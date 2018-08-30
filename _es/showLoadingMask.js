var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import Loading from "./Loading";
import { renderOnDocSimple } from "./utils/renderOnDoc";
import FillWindow from "./FillWindow";

export default function showLoadingMask() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return renderOnDocSimple(React.createElement(
    "div",
    null,
    React.createElement(FillWindow, { containerStyle: { background: "grey", opacity: .5 } }),
    React.createElement(
      FillWindow,
      { containerStyle: { opacity: 1, background: "none" } },
      function (_ref) {
        var width = _ref.width,
            height = _ref.height;

        return React.createElement(
          "div",
          { style: { width: width, height: height } },
          React.createElement(Loading, _extends({
            displayInstantly: true,
            containerStyle: {
              opacity: 1,
              display: "flex",
              justifyContent: "center"
            }
          }, opts)),
          ")"
        );
      }
    )
  ));
}