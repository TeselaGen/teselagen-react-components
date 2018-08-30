"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _lodash = require("lodash");

var _recompose = require("recompose");

var _CollapsibleCard = require("../CollapsibleCard");

var _CollapsibleCard2 = _interopRequireDefault(_CollapsibleCard);

var _InfoHelper = require("../InfoHelper");

var _InfoHelper2 = _interopRequireDefault(_InfoHelper);

var _DataTable = require("../DataTable");

var _DataTable2 = _interopRequireDefault(_DataTable);

var _withTableParams = require("../DataTable/utils/withTableParams");

var _withTableParams2 = _interopRequireDefault(_withTableParams);

var _withQueryDynamic = require("../enhancers/withQueryDynamic");

var _withQueryDynamic2 = _interopRequireDefault(_withQueryDynamic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      createSchema = _ref$createSchema === undefined ? _lodash.noop : _ref$createSchema,
      _ref$processData = _ref.processData,
      processData = _ref$processData === undefined ? _lodash.identity : _ref$processData;

  var entities = maybeEntities || tableParams.entities || [];
  return _react2.default.createElement(
    _CollapsibleCard2.default,
    {
      icon: helperMessage && _react2.default.createElement(
        _InfoHelper2.default,
        null,
        helperMessage
      ),
      title: title,
      initialClosed: (0, _lodash.isEmpty)(tableParams) && entities && !entities.length,
      openTitleElements: [isLinkable && _react2.default.createElement(
        _core.Button,
        { key: "linkButton", onClick: function onClick() {
            return showLinkModal();
          } },
        linkButtonText || "Link " + title
      )].concat(openTitleElements)
    },
    _react2.default.createElement(_DataTable2.default, _extends({}, tableProps, {
      onDoubleClick: onDoubleClick,
      formName: (0, _lodash.camelCase)(title) //because these tables are currently not connected to table params, we need to manually pass a formName here
      , cellRenderer: cellRenderer
    }, tableParams, {
      entities: processData(entities)
      // schema is weird because we are sometimes generating schema off of the entities
      , schema: createSchema(entities) || tableParams.schema || schema
    })),
    children
  );
}

exports.default = (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
  var fragment = props.fragment,
      title = props.title,
      maybeSchema = props.schema,
      j5ReportId = props.j5ReportId;

  if (!fragment) return {
    formName: (0, _lodash.camelCase)(title)
  };
  var modelName = (0, _lodash.get)(fragment, "definitions[0].typeCondition.name.value");
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
    formName: (0, _lodash.camelCase)(title),
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
}), (0, _recompose.branch)(function (props) {
  return props.runTimeQueryOptions;
}, (0, _recompose.compose)((0, _withTableParams2.default)({
  urlConnected: false,
  defaults: {
    pageSize: 5
  }
}), (0, _withQueryDynamic2.default)({
  isPlural: true
}))))(J5TableCard);
module.exports = exports["default"];