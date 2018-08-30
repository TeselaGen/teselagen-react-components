var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @param {options} options
 * @typedef {object} options
 * @property {boolean} isPlural Are we searching for 1 thing or many?
 * @property {string} queryName What the props come back on ( by default = modelName + 'Query')
 */
import withTableParams from "../DataTable/utils/withTableParams";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import { arrayMove } from "react-sortable-hoc";
import { toArray, keyBy, get } from "lodash";
import withFields from "../enhancers/withFields";
import { withProps, withState, branch } from "recompose";
import pureNoFunc from "../utils/pureNoFunc";
import convertSchema from "../DataTable/utils/convertSchema";
import viewColumn from "../DataTable/viewColumn";

export default compose(
//connect to withTableParams here in the dataTable component so that, in the case that the table is not manually connected,
withTableParams({
  isLocalCall: true
}), withState("showForcedHiddenColumns", "setShowForcedHidden", false),
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
withProps(function (ownProps) {
  var propsToUse = ownProps;
  if (!ownProps.isTableParamsConnected) {
    //this is the case where we're hooking up to withTableParams locally, so we need to take the tableParams off the props
    propsToUse = _extends({}, ownProps, ownProps.tableParams);
  }

  var _propsToUse = propsToUse,
      schema = _propsToUse.schema,
      withDisplayOptions = _propsToUse.withDisplayOptions,
      syncDisplayOptionsToDb = _propsToUse.syncDisplayOptionsToDb,
      formName = _propsToUse.formName,
      tableConfigurations = _propsToUse.tableConfigurations,
      deleteTableConfiguration = _propsToUse.deleteTableConfiguration,
      upsertTableConfiguration = _propsToUse.upsertTableConfiguration,
      upsertFieldOption = _propsToUse.upsertFieldOption,
      currentUser = _propsToUse.currentUser,
      isViewable = _propsToUse.isViewable,
      _propsToUse$entities = _propsToUse.entities,
      entities = _propsToUse$entities === undefined ? [] : _propsToUse$entities,
      _propsToUse$cellRende = _propsToUse.cellRenderer,
      cellRenderer = _propsToUse$cellRende === undefined ? {} : _propsToUse$cellRende,
      showForcedHiddenColumns = _propsToUse.showForcedHiddenColumns,
      isSimple = _propsToUse.isSimple,
      isInfinite = _propsToUse.isInfinite;

  var schemaToUse = convertSchema(schema);
  var fieldOptsByPath = {};
  var tableConfig = {};
  var resetDefaultVisibility = void 0;
  var updateColumnVisibility = void 0;
  var moveColumnPersist = void 0;
  var resizePersist = void 0;
  var resized = void 0;
  var updateTableDisplayDensity = void 0;
  var userSpecifiedCompact = void 0;

  if (isViewable) {
    schemaToUse.fields = [viewColumn].concat(schemaToUse.fields);
  }
  var hasOptionForForcedHidden = withDisplayOptions && (isSimple || isInfinite);
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
    userSpecifiedCompact = tableConfig.density === "compact";
    var columnOrderings = tableConfig.columnOrderings;
    fieldOptsByPath = keyBy(tableConfig.fieldOptions, "path");
    schemaToUse = _extends({}, schemaToUse, {
      fields: schemaToUse.fields.map(function (field) {
        var fieldOpt = fieldOptsByPath[field.path];
        var noValsForField = false;
        // only add this hidden column ability if no paging
        if (!showForcedHiddenColumns && hasOptionForForcedHidden) {
          noValsForField = entities.every(function (e) {
            var val = get(e, field.path);
            return field.render ? !field.render(val, e) : cellRenderer[field.path] ? !cellRenderer[field.path](val, e) : !val;
          });
        }
        if (noValsForField) {
          return _extends({}, field, {
            isHidden: true,
            isForcedHidden: true
          });
        } else if (fieldOpt) {
          return _extends({}, field, {
            isHidden: fieldOpt.isHidden
          });
        } else {
          return field;
        }
      })
    });

    if (columnOrderings) {
      schemaToUse.fields = schemaToUse.fields.sort(function (_ref, _ref2) {
        var path1 = _ref.path;
        var path2 = _ref2.path;

        return columnOrderings.indexOf(path1) - columnOrderings.indexOf(path2);
      });
    }

    if (syncDisplayOptionsToDb) {
      //sync up to db
      var tableConfigurationId = void 0;
      resetDefaultVisibility = function resetDefaultVisibility() {
        tableConfigurationId = tableConfig.id;

        if (tableConfigurationId) {
          deleteTableConfiguration(tableConfigurationId);
        }
      };
      updateColumnVisibility = function updateColumnVisibility(_ref3) {
        var shouldShow = _ref3.shouldShow,
            path = _ref3.path;

        if (tableConfigurationId) {
          // toArray({...stripFields(fieldOptsByPath, ['__typename']), [path]: {isHidden: !shouldShow, path, ...stripFields(fieldOptsByPath[path] || {}, ['__typename']) }  })
          var existingFieldOpt = fieldOptsByPath[path] || {};
          upsertFieldOption({
            id: existingFieldOpt.id,
            path: path,
            isHidden: !shouldShow,
            tableConfigurationId: tableConfigurationId
          });
        } else {
          upsertTableConfiguration({
            userId: currentUser.user.id,
            formName: formName,
            fieldOptions: [{
              path: path,
              isHidden: !shouldShow
            }]
          });
        }
      };
    } else {
      //sync display options with localstorage
      resetDefaultVisibility = function resetDefaultVisibility() {
        window.localStorage.removeItem(formName);
      };
      updateColumnVisibility = function updateColumnVisibility(_ref4) {
        var path = _ref4.path,
            paths = _ref4.paths,
            shouldShow = _ref4.shouldShow;

        var newFieldOpts = _extends({}, fieldOptsByPath);
        var pathsToUse = paths ? paths : [path];
        pathsToUse.forEach(function (path) {
          newFieldOpts[path] = { path: path, isHidden: !shouldShow };
        });
        tableConfig.fieldOptions = toArray(newFieldOpts);
        window.localStorage.setItem(formName, JSON.stringify(tableConfig));
      };
      updateTableDisplayDensity = function updateTableDisplayDensity(density) {
        tableConfig.density = density;
        window.localStorage.setItem(formName, JSON.stringify(tableConfig));
      };
      moveColumnPersist = function moveColumnPersist(_ref5) {
        var oldIndex = _ref5.oldIndex,
            newIndex = _ref5.newIndex;

        // we might already have an array of the fields [path1, path2, ..etc]
        var columnOrderings = tableConfig.columnOrderings || schemaToUse.fields.map(function (_ref6) {
          var path = _ref6.path;
          return path;
        }); // columnOrderings is [path1, path2, ..etc]

        tableConfig.columnOrderings = arrayMove(columnOrderings, oldIndex, newIndex);
        window.localStorage.setItem(formName, JSON.stringify(tableConfig));
      };
      resizePersist = function resizePersist(newResized) {
        tableConfig.resized = newResized;
        window.localStorage.setItem(formName, JSON.stringify(tableConfig));
      };
    }
  }
  resized = tableConfig.resized;
  return _extends({}, propsToUse, {
    schema: schemaToUse,
    resized: resized,
    resetDefaultVisibility: resetDefaultVisibility,
    updateColumnVisibility: updateColumnVisibility,
    updateTableDisplayDensity: updateTableDisplayDensity,
    userSpecifiedCompact: userSpecifiedCompact,
    resizePersist: resizePersist,
    moveColumnPersist: moveColumnPersist,
    hasOptionForForcedHidden: hasOptionForForcedHidden
  });
}), reduxForm({}), //the formName is passed via withTableParams and is often user overridden
withFields({
  names: ["localStorageForceUpdate", "reduxFormQueryParams", "reduxFormSearchInput", "reduxFormSelectedEntityIdMap", "reduxFormExpandedEntityIdMap"]
}), branch(function (props) {
  return !props.alwaysRerender;
}, pureNoFunc));