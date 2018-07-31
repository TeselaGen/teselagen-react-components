import React from "react";
import { Button } from "@blueprintjs/core";
import { camelCase, noop, get, identity } from "lodash";
import { compose, withProps, branch } from "recompose";
import CollapsibleCard from "../CollapsibleCard";
import InfoHelper from "../InfoHelper";
import DataTable from "../DataTable";
import withTableParams from "../DataTable/utils/withTableParams";
import withQuery from "../enhancers/withQuery/withQuery";

function J5TableCard({
  title,
  helperMessage,
  entities, // directly passed, not remote paging
  tableProps,
  schema,
  showLinkModal,
  onDoubleClick,
  isLinkable,
  cellRenderer,
  openTitleElements,
  linkButtonText,
  children,
  tableParams = {},
  createSchema = noop,
  processData = identity,
  formName
}) {
  console.log('tableParams:', tableParams)
  // formName undefined somehow
  console.log("formName:", formName);
  return (
    <CollapsibleCard
      icon={helperMessage && <InfoHelper>{helperMessage}</InfoHelper>}
      title={title}
      initialClosed={entities && !entities.length}
      openTitleElements={[
        isLinkable && (
          <Button key="linkButton" onClick={() => showLinkModal()}>
            {linkButtonText || `Link ${title}`}
          </Button>
        ),
        ...openTitleElements
      ]}
    >
      <DataTable
        {...tableProps}
        onDoubleClick={onDoubleClick}
        formName={camelCase(title)} //because these tables are currently not connected to table params, we need to manually pass a formName here
        cellRenderer={cellRenderer}
        entities={processData(entities || [])}
        {...tableParams}
        // schema is weird because we are sometimes generating schema off of the entities
        schema={createSchema(entities || []) || tableParams.schema || schema}
      />
      {children}
    </CollapsibleCard>
  );
}

// export default adHoc(props => {
//   const { fragment, title, schema: maybeSchema, j5ReportId } = props;
//   if (!fragment) {
//     return [];
//   }
//   const modelName = get(fragment, "definitions[0].typeCondition.name.value");
//   let schema = maybeSchema;
//   if (schema && !schema.model) {
//     if (Array.isArray(schema))
//       schema = {
//         fields: schema
//       };
//     schema.model = modelName;
//   }
//   // this happens when we are creating the schema based on the entities
//   if (!schema) {
//     schema = {
//       model: modelName,
//       fields: []
//     };
//   }
//   return [
//     withTableParams({
//       formName: camelCase(title),
//       urlConnected: false,
//       schema
//     }),
//     withQuery(fragment, {
//       isPlural: true,
//       options: {
//         filter: {
//           j5ReportId
//         }
//       }
//     })
//   ];
// })(J5TableCard);

export default compose(
  withProps(props => {
    const { fragment, title, schema: maybeSchema, j5ReportId } = props;
    if (!fragment)
      return {
        formName: camelCase(title)
      };
    const modelName = get(fragment, "definitions[0].typeCondition.name.value");
    let schema = maybeSchema;
    if (schema && !schema.model) {
      if (Array.isArray(schema))
        schema = {
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
      schema,
      formName: camelCase(title),
      options: {
        filter: {
          j5ReportId
        }
      }
    };
  }),
  branch(
    props => props.fragment,
    compose(
      withTableParams({
        urlConnected: false
      }),
      withQuery()
    )
  )
)(J5TableCard);
