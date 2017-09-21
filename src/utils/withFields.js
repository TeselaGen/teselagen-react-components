import React from "react";
import { Fields } from "redux-form";

export default function WithFields(fieldsProps) {
  return function AddFieldsHOC(Component) {
    return function AddFields(props) {
      return <Fields {...fieldsProps} {...props} component={Component} />;
    };
  };
}
