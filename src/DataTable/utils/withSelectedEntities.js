//@flow

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
export default function withSelectedEntities(...formNames) {
  if (!formNames.length) {
    throw new Error(
      "You need to pass at least one arg to withSelectedEntities"
    );
  }
  if (typeof formNames[0] === "string") {
    //NEW WAY
    return connect(state => {
      return formNames.reduce((acc, formName) => {
        acc[formName + "SelectedEntities"] = getRecordsFromIdMap(
          state,
          formName
        );
        return acc;
      }, {});
    });
  } else {
    //OLD WAY:
    const { formName, name } = formNames[0];
    if (!formName) {
      throw new Error(
        "Please pass a {formName} option when using withSelectedEntities"
      );
    }
    return connect(state => {
      return {
        [name || "selectedEntities"]: getRecordsFromIdMap(state, formName)
      };
    });
  }
}

export function getRecordsFromIdMap(state, formName) {
  const selector = formValueSelector(formName);
  const selectedEntityIdMap =
    selector(state, "reduxFormSelectedEntityIdMap") || {};
  return reduce(
    selectedEntityIdMap,
    (acc, item) => {
      if (item && item.entity) acc.push(item.entity);
      return acc;
    },
    []
  );
}

export function getSelectedEntities(storeOrState, formName) {
  const state = storeOrState.getState ? storeOrState.getState() : storeOrState
  return getRecordsFromIdMap(state, formName)
}
