//@flow

import { formValueSelector } from "redux-form";
import { map } from "lodash";
import { connect } from "react-redux";

export default function withSelectedEntities({ formName, name }) {
  connect(state => {
    return {
      [name || "selectedEntities"]: map(
        formValueSelector(formName)(state, "reduxFormSelectedEntityIdMap"),
        item => {
          return item.entity;
        }
      )
    };
  });
}
