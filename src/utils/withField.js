import React from "react";
import { Field } from "redux-form";

export default function WithField(fieldProps) {
  return function AddFieldHOC(Component) {
    return function AddField(props) {
      return <Field {...fieldProps} {...props} component={Component} />;
    };
  };
}
