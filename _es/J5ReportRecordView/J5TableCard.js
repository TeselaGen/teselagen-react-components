var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import { Button } from "@blueprintjs/core";
import { camelCase, noop, get, identity, isEmpty } from "lodash";
import { compose, withProps, branch } from "recompose";
import CollapsibleCard from "../CollapsibleCard";
import InfoHelper from "../InfoHelper";
import DataTable from "../DataTable";
import withTableParams from "../DataTable/utils/withTableParams";
import withQueryDynamic from "../enhancers/withQueryDynamic";

function J5TableCard(_ref) {
  var title = _ref.title,
      helperMessage = _ref.helperMessage,
      maybeEntities = _ref.entities,
      tableProps = _ref.tableProps,
      schema = _ref.schema,
      showLinkModal = _ref.showLinkModal,
      onDoubleClick = _ref.onDoubleClick,
      isLinkable = _ref.isLinkable,
      cellRenderer = _ref.cellRenderer,
      openTitleElements = _ref.openTitleElements,
      linkButtonText = _ref.linkButtonText,
      children = _ref.children,
      _ref$tableParams = _ref.tableParams,
      tableParams = _ref$tableParams === undefined ? {} : _ref$tableParams,
      _ref$createSchema = _ref.createSchema,
      createSchema = _ref$createSchema === undefined ? noop : _ref$createSchema,
      _ref$processData = _ref.processData,
      processData = _ref$processData === undefined ? identity : _ref$processData;

  var entities = maybeEntities || tableParams.entities || [];
  return React.createElement(
    CollapsibleCard,
    {
      icon: helperMessage && React.createElement(
        InfoHelper,
        null,
        helperMessage
      ),
      title: title,
      initialClosed: isEmpty(tableParams) && entities && !entities.length,
      openTitleElements: [isLinkable && React.createElement(
        Button,
        { key: "linkButton", onClick: function onClick() {
            return showLinkModal();
          } },
        linkButtonText || "Link " + title
      )].concat(openTitleElements)
    },
    React.createElement(DataTable, _extends({}, tableProps, {
      onDoubleClick: onDoubleClick,
      formName: camelCase(title) //because these tables are currently not connected to table params, we need to manually pass a formName here
      , cellRenderer: cellRenderer
    }, tableParams, {
      entities: processData(entities)
      // schema is weird because we are sometimes generating schema off of the entities
      , schema: createSchema(entities) || tableParams.schema || schema
    })),
    children
  );
}

export default compose(withProps(function (props) {
  var fragment = props.fragment,
      title = props.title,
      maybeSchema = props.schema,
      j5ReportId = props.j5ReportId;

  if (!fragment) return {
    formName: camelCase(title)
  };
  var modelName = get(fragment, "definitions[0].typeCondition.name.value");
  var schema = maybeSchema;
  if (schema && !schema.model) {
    if (Array.isArray(schema)) schema = {
      fields: schema
    };
    schema.model = modelName;
  }
  // this happens when we are creating the schema based on the entities
  if (!schema) {
    schema = {
      model: modelName,
      fields: []
    };
  }
  return {
    schema: schema,
    formName: camelCase(title),
    runTimeQueryOptions: {
      fragment: fragment,
      options: {
        variables: {
          filter: {
            j5ReportId: j5ReportId
          }
        }
      }
    }
  };
}), branch(function (props) {
  return props.runTimeQueryOptions;
}, compose(withTableParams({
  urlConnected: false,
  defaults: {
    pageSize: 5
  }
}), withQueryDynamic({
  isPlural: true
}))))(J5TableCard);