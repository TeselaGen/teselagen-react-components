import React from "react";
import { ProgressBar, Intent, Button, Tooltip, Position, Icon } from "@blueprintjs/core";

var itemUpload = function itemUpload(props) {
  var item = props.item;
  var name = nameShortener(item.name);

  return React.createElement(
    "div",
    { className: "item-upload-container", key: item.id },
    React.createElement(
      "div",
      { className: "item-upload" },
      React.createElement(
        "div",
        null,
        !props.saved ? React.createElement(
          Tooltip,
          {
            content: React.createElement(
              "span",
              null,
              "Click to\n              " + (props.active ? "abort this uploading" : "remove this file")
            ),
            position: Position.LEFT,
            usePortal: true
          },
          React.createElement(Button, {
            intent: Intent.DANGER,
            minimal: true,
            icon: "delete",
            onClick: props.onCancel
          })
        ) : null
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "span",
          null,
          name
        )
      ),
      React.createElement(
        "div",
        null,
        props.active ? props.value + "%" : null,
        props.error ? React.createElement(
          Tooltip,
          { content: props.error, usePortal: true },
          React.createElement(Icon, { icon: "error", intent: Intent.DANGER })
        ) : null,
        props.saved ? React.createElement(
          Tooltip,
          { content: "File Saved", usePortal: true },
          React.createElement(Icon, { icon: "saved", intent: Intent.SUCCESS })
        ) : null
      )
    ),
    props.active ? React.createElement(ProgressBar, { intent: Intent.PRIMARY, value: props.value / 100 }) : null
  );
};

/**
 * Short file names length to display
 * @param {*} itemName
 */
var nameShortener = function nameShortener(itemName) {
  if (itemName.length > 40) {
    var name = "";
    var arr = itemName.split(".");
    name += arr[0].substring(0, 20) + "...";
    if (arr.length >= 2) {
      name += "" + arr[arr.length - 2].substring(arr[arr.length - 2].length - 5, arr[arr.length - 2].length);
      name += "." + arr[arr.length - 1];
    }
    return name;
  }
  return itemName;
};

export default itemUpload;