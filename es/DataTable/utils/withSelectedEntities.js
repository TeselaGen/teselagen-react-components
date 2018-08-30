import { formValueSelector } from "redux-form";
import { reduce } from "lodash";
import { connect } from "react-redux";
/**
 *
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} ...etc
 */
export default function withSelectedEntities() {
  for (var _len = arguments.length, formNames = Array(_len), _key = 0; _key < _len; _key++) {
    formNames[_key] = arguments[_key];
  }

  if (!formNames.length) {
    throw new Error("You need to pass at least one arg to withSelectedEntities");
  }
  if (typeof formNames[0] === "string") {
    //NEW WAY
    return connect(function (state) {
      return formNames.reduce(function (acc, formName) {
        acc[formName + "SelectedEntities"] = getRecordsFromIdMap(state, formName);
        return acc;
      }, {});
    });
  } else {
    //OLD WAY:
    var _formNames$ = formNames[0],
        formName = _formNames$.formName,
        name = _formNames$.name;

    if (!formName) {
      throw new Error("Please pass a {formName} option when using withSelectedEntities");
    }
    return connect(function (state) {
      var _ref;

      return _ref = {}, _ref[name || "selectedEntities"] = getRecordsFromIdMap(state, formName), _ref;
    });
  }
}

export function getRecordsFromIdMap(state, formName) {
  var selector = formValueSelector(formName);
  var selectedEntityIdMap = selector(state, "reduxFormSelectedEntityIdMap") || {};
  return reduce(selectedEntityIdMap, function (acc, item) {
    if (item && item.entity) acc.push(item.entity);
    return acc;
  }, []);
}

export function getSelectedEntities(storeOrState, formName) {
  var state = storeOrState.getState ? storeOrState.getState() : storeOrState;
  return getRecordsFromIdMap(state, formName);
}