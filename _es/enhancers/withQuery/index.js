var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import _withQuery from "./withQuery";
import Loading from "../../Loading";

export default function withQuery(fragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  //passing a default LoadingComponent to withQuery
  return _withQuery(fragment, _extends({}, options, {
    LoadingComp: function LoadingComp(props) {
      return React.createElement(Loading, props);
    }
  }));
}