import React from "react";
import { Classes } from "@blueprintjs/core";
import classNames from "classnames";

export default function BlueprintError(_ref) {
  var error = _ref.error;

  if (!error) return null;
  return React.createElement(
    "div",
    { className: classNames(Classes.FORM_GROUP, Classes.INTENT_DANGER) },
    React.createElement(
      "div",
      { className: classNames(Classes.FORM_HELPER_TEXT, "preserve-newline") },
      error
    )
  );
}