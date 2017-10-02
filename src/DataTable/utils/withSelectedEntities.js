//@flow

import { formValueSelector } from "redux-form";
import { map } from "lodash";
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
        const selectedEntityIdMap = formValueSelector(formName)(
          state,
          "reduxFormSelectedEntityIdMap" || {}
        );
        acc[formName + "SelectedEntities"] = map(selectedEntityIdMap, item => {
          return item.entity;
        });
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
    const selector = formValueSelector(formName);

    return connect(state => {
      const selectedEntityIdMap =
        selector(state, "reduxFormSelectedEntityIdMap") || {};
      return {
        [name || "selectedEntities"]: map(selectedEntityIdMap, item => {
          return item.entity;
        })
      };
    });
  }
}
