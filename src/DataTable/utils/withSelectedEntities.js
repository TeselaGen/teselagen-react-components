//@flow

import { formValueSelector } from "redux-form";
import { map } from "lodash";
import { connect } from "react-redux";

export default function withSelectedEntities({ formName, name }) {
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
