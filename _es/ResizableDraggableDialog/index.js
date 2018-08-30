var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import Rnd from "react-rnd";
import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import "./style.css";

export default function ResizableDraggableDialog(_ref) {
  var _ref$width = _ref.width,
      defaultDialogWidth = _ref$width === undefined ? 400 : _ref$width,
      _ref$height = _ref.height,
      defaultDialogHeight = _ref$height === undefined ? 450 : _ref$height,
      RndProps = _ref.RndProps,
      rest = _objectWithoutProperties(_ref, ["width", "height", "RndProps"]);

  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
      windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
  return React.createElement(
    "div",
    {
      className: "tg-bp3-dialog-resizable-draggable",
      style: { top: 0, left: 0, position: "fixed" }
    },
    React.createElement(
      Rnd,
      _extends({
        enableResizing: {
          bottomLeft: true,
          bottomRight: true,
          topLeft: true,
          topRight: true
        },
        minWidth: Math.min(defaultDialogWidth, 300),
        minHeight: Math.min(defaultDialogHeight, 200),
        bounds: "window",
        "default": {
          x: Math.max((windowWidth - defaultDialogWidth) / 2, 0),
          y: Math.max((windowHeight - defaultDialogHeight) / 2, 0),
          width: Math.min(defaultDialogWidth, windowWidth),
          height: Math.min(defaultDialogHeight, windowHeight)
        },
        dragHandleClassName: Classes.DIALOG_HEADER
      }, RndProps),
      React.createElement(Dialog, _extends({ hasBackdrop: false, usePortal: false }, rest))
    )
  );
}