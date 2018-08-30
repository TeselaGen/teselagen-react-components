var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import { Fields } from "redux-form";
//simple enhancer that wraps a component in a redux <Fields/> component
//all options are passed as props to <Fields/>
export default function WithFields(fieldsProps) {
  return function AddFieldsHOC(Component) {
    return function AddFields(props) {
      return React.createElement(Fields, _extends({}, fieldsProps, props, { component: Component }));
    };
  };
}