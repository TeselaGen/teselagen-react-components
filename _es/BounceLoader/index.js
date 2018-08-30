/* taken from http://tobiasahlin.com/spinkit/ */
import React from "react";
import classNames from "classnames";
import "./style.css";

export default function BounceLoader(_ref) {
  var style = _ref.style,
      className = _ref.className;

  return React.createElement(
    "div",
    { className: classNames("tg-bounce-loader", className), style: style },
    React.createElement("div", { className: "rect1" }),
    React.createElement("div", { className: "rect2" }),
    React.createElement("div", { className: "rect3" }),
    React.createElement("div", { className: "rect4" }),
    React.createElement("div", { className: "rect5" })
  );
}