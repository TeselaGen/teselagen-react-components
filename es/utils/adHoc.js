import React from "react";
import { compose } from "recompose";

//adHoc allows you to add dynamic HOCs to a component
export default (function (func) {
  return function (WrappedComponent) {
    return function (props) {
      var calledFunc = func(props);
      var composeArgs = Array.isArray(calledFunc) ? calledFunc : [calledFunc];
      var ComposedAndWrapped = compose.apply(undefined, composeArgs)(WrappedComponent);
      return React.createElement(ComposedAndWrapped, props);
    };
  };
});