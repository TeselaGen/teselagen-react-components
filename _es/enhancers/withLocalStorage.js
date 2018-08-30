var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import { Field } from "redux-form";
//simple enhancer that wraps a component in a redux <Field/> component
//all options are passed as props to <Field/>
export default function WithField(fieldProps) {
  return function AddFieldHOC(Component) {
    return function AddField(props) {
      return React.createElement(Field, _extends({}, fieldProps, props, { component: Component }));
    };
  };
}