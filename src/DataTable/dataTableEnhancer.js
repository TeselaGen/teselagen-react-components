/**
 * @param {options} options
 * @typedef {object} options
 * @property {boolean} isPlural Are we searching for 1 thing or many?
 * @property {string} queryName What the props come back on ( by default = modelName + 'Query')
 */
import { reduxForm, formValues } from "redux-form";
import { compose } from "redux";
import { arrayMove } from "react-sortable-hoc";
import { toArray, keyBy, get } from "lodash";
import { withProps, withState, branch } from "recompose";
import withTableParams from "../DataTable/utils/withTableParams";
import convertSchema from "../DataTable/utils/convertSchema";
import viewColumn from "../DataTable/viewColumn";
import pureNoFunc from "../utils/pureNoFunc";

export default compose(
  //connect to withTableParams here in the dataTable component so that, in the case that the table is not manually connected,
  withTableParams({
    isLocalCall: true
  }),
  withState("showForcedHiddenColumns", "setShowForcedHidden", false),
  // withDelete(tableConfigurationFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withUpsert(tableConfigurationFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withUpsert(fieldOptionFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withQuery(currentUserFragment, {
  //   argsOverride: ["", ""],
  //   nameOverride: "currentUser",
  //   queryName: "dataTableCurrentUserQuery",
  //   options: props => {
  //     const { withDisplayOptions, syncDisplayOptionsToDb } = props;
  //     return {
  //       skip: !syncDisplayOptionsToDb || !withDisplayOptions
  //     };
  //   }
  // }),
  // withQuery(tableConfigurationFragment, {
  //   queryName: "tableConfigurationQuery",
  //   isPlural: true,
  //   options: props => {
  //     const {
  //       formName,
  //       withDisplayOptions,
  //       syncDisplayOptionsToDb,
  //       currentUser
  //     } = props;
  //     const userId = get(currentUser, "user.id");
  //     return {
  //       skip: !syncDisplayOptionsToDb || !withDisplayOptions || !userId,
  //       variables: {
  //         filter: {
  //           userId,
  //           formName
  //         }
  //       }
  //     };
  //   }
  // }),
  withProps(ownProps => {
    let propsToUse = ownProps;
    if (!ownProps.isTableParamsConnected) {
      //this is the case where we're hooking up to withTableParams locally, so we need to take the tableParams off the props
      propsToUse = {
        ...ownProps,
        ...ownProps.tableParams
      };
    }

    const {
      schema,
      withDisplayOptions,
      syncDisplayOptionsToDb,
      formName,
      tableConfigurations,
      deleteTableConfiguration,
      upsertTableConfiguration,
      upsertFieldOption,
      currentUser,
      isViewable,
      entities = [],
      cellRenderer = {},
      showForcedHiddenColumns,
      isSimple,
      isInfinite,
      compact
    } = propsToUse;
    let schemaToUse = convertSchema(schema);
    let fieldOptsByPath = {};
    let tableConfig = {};
    let resetDefaultVisibility;
    let updateColumnVisibility;
    let moveColumnPersist;
    let resizePersist;
    let resized;
    let updateTableDisplayDensity;
    let compactToUse = !!compact;

    if (isViewable) {
      schemaToUse.fields = [viewColumn, ...schemaToUse.fields];
    }
    let hasOptionForForcedHidden =
      withDisplayOptions && (isSimple || isInfinite);
    if (withDisplayOptions) {
      if (syncDisplayOptionsToDb) {
        tableConfig = tableConfigurations && tableConfigurations[0];
      } else {
        tableConfig = window.localStorage.getItem(formName);
        tableConfig = tableConfig && JSON.parse(tableConfig);
      }
      if (!tableConfig) {
        tableConfig = {
          fieldOptions: []
        };
      }
      if (tableConfig.density) {
        compactToUse = tableConfig.density === "compact";
      }
      const columnOrderings = tableConfig.columnOrderings;
      fieldOptsByPath = keyBy(tableConfig.fieldOptions, "path");
      schemaToUse = {
        ...schemaToUse,
        fields: schemaToUse.fields.map(field => {
          const fieldOpt = fieldOptsByPath[field.path];
          let noValsForField = false;
          // only add this hidden column ability if no paging
          if (!showForcedHiddenColumns && hasOptionForForcedHidden) {
            noValsForField = entities.every(e => {
              const val = get(e, field.path);
              return field.render
                ? !field.render(val, e)
                : cellRenderer[field.path]
                ? !cellRenderer[field.path](val, e)
                : !val;
            });
          }
          if (noValsForField) {
            return {
              ...field,
              isHidden: true,
              isForcedHidden: true
            };
          } else if (fieldOpt) {
            return {
              ...field,
              isHidden: fieldOpt.isHidden
            };
          } else {
            return field;
          }
        })
      };

      if (columnOrderings) {
        const fieldsWithOrders = [];
        const fieldsWithoutOrder = [];
        // if a new field has been added since the orderings were set then we want
        // it to be at the end instead of the beginning
        schemaToUse.fields.forEach(field => {
          if (columnOrderings.indexOf(field.path) > -1) {
            fieldsWithOrders.push(field);
          } else {
            fieldsWithoutOrder.push(field);
          }
        });
        schemaToUse.fields = fieldsWithOrders
          .sort(({ path: path1 }, { path: path2 }) => {
            return (
              columnOrderings.indexOf(path1) - columnOrderings.indexOf(path2)
            );
          })
          .concat(fieldsWithoutOrder);
      }

      if (syncDisplayOptionsToDb) {
        //sync up to db
        let tableConfigurationId;
        resetDefaultVisibility = function() {
          tableConfigurationId = tableConfig.id;

          if (tableConfigurationId) {
            deleteTableConfiguration(tableConfigurationId);
          }
        };
        updateColumnVisibility = function({ shouldShow, path }) {
          if (tableConfigurationId) {
            // toArray({...stripFields(fieldOptsByPath, ['__typename']), [path]: {isHidden: !shouldShow, path, ...stripFields(fieldOptsByPath[path] || {}, ['__typename']) }  })
            const existingFieldOpt = fieldOptsByPath[path] || {};
            upsertFieldOption({
              id: existingFieldOpt.id,
              path,
              isHidden: !shouldShow,
              tableConfigurationId
            });
          } else {
            upsertTableConfiguration({
              userId: currentUser.user.id,
              formName,
              fieldOptions: [
                {
                  path,
                  isHidden: !shouldShow
                }
              ]
            });
          }
        };
      } else {
        //sync display options with localstorage
        resetDefaultVisibility = function() {
          window.localStorage.removeItem(formName);
        };
        updateColumnVisibility = function({ path, paths, shouldShow }) {
          const newFieldOpts = {
            ...fieldOptsByPath
          };
          let pathsToUse = paths ? paths : [path];
          pathsToUse.forEach(path => {
            newFieldOpts[path] = { path, isHidden: !shouldShow };
          });
          tableConfig.fieldOptions = toArray(newFieldOpts);
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        updateTableDisplayDensity = function(density) {
          tableConfig.density = density;
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        moveColumnPersist = function({ oldIndex, newIndex }) {
          // we might already have an array of the fields [path1, path2, ..etc]
          const columnOrderings =
            tableConfig.columnOrderings ||
            schemaToUse.fields.map(({ path }) => path); // columnOrderings is [path1, path2, ..etc]

          tableConfig.columnOrderings = arrayMove(
            columnOrderings,
            oldIndex,
            newIndex
          );
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        resizePersist = function(newResized) {
          tableConfig.resized = newResized;
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
      }
    }
    resized = tableConfig.resized;
    return {
      ...propsToUse,
      schema: schemaToUse,
      compact: compactToUse,
      resized,
      resetDefaultVisibility,
      updateColumnVisibility,
      updateTableDisplayDensity,
      resizePersist,
      moveColumnPersist,
      hasOptionForForcedHidden
    };
  }),
  reduxForm({}), //the formName is passed via withTableParams and is often user overridden
  formValues(
    "localStorageForceUpdate",
    "reduxFormQueryParams",
    "reduxFormSearchInput",
    "reduxFormSelectedEntityIdMap",
    "reduxFormExpandedEntityIdMap"
  ),
  // withFields({
  //   names: [
  //     "localStorageForceUpdate",
  //     "reduxFormQueryParams",
  //     "reduxFormSearchInput",
  //     "reduxFormSelectedEntityIdMap",
  //     "reduxFormExpandedEntityIdMap"
  //   ]
  // }),
  branch(props => !props.alwaysRerender, pureNoFunc)
);
