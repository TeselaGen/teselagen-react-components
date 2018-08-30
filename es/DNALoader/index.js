import React from "react";
import classNames from "classnames";
import "./style.css";

export default function DNALoader(_ref) {
  var style = _ref.style,
      className = _ref.className;

  return React.createElement(
    "div",
    { className: classNames("dna-loader", className), style: style },
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" }),
    React.createElement("div", { className: "nucleobase" })
  );
}