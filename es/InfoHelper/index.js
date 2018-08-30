var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { Popover, Button, Tooltip, Icon, Classes } from "@blueprintjs/core";

var InfoHelper = function (_Component) {
  _inherits(InfoHelper, _Component);

  function InfoHelper() {
    _classCallCheck(this, InfoHelper);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  InfoHelper.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        content = _props.content,
        children = _props.children,
        _props$icon = _props.icon,
        icon = _props$icon === undefined ? "info-sign" : _props$icon,
        isPopover = _props.isPopover,
        isButton = _props.isButton,
        size = _props.size,
        _props$popoverProps = _props.popoverProps,
        popoverProps = _props$popoverProps === undefined ? {} : _props$popoverProps,
        disabled = _props.disabled,
        displayToSide = _props.displayToSide,
        style = _props.style,
        rest = _objectWithoutProperties(_props, ["className", "content", "children", "icon", "isPopover", "isButton", "size", "popoverProps", "disabled", "displayToSide", "style"]);

    var IconToUse = isButton ? Button : Icon;
    var IconInner = React.createElement(IconToUse, _extends({
      icon: icon,
      className: className,
      iconSize: size,
      disabled: disabled
    }, rest));
    var toReturn = void 0;
    if (displayToSide) {
      toReturn = React.createElement(
        React.Fragment,
        null,
        IconInner,
        React.createElement(
          "span",
          { style: { paddingLeft: 5, fontStyle: "italic" } },
          content || children
        )
      );
    } else if (isPopover) {
      toReturn = React.createElement(Popover, _extends({
        disabled: disabled,
        popoverClassName: Classes.DARK,
        target: React.createElement(Button, {
          style: { borderRadius: 15, borderWidth: 5 },
          minimal: true,
          className: className,
          icon: icon
        }),
        content: React.createElement(
          "div",
          { style: { padding: 5 } },
          content || children
        )
      }, popoverProps));
    } else {
      toReturn = React.createElement(Tooltip, _extends({
        disabled: disabled,
        target: IconInner,
        content: content || children
      }, popoverProps));
    }
    return React.createElement(
      "div",
      {
        style: _extends({ display: "flex" }, style),
        className: "info-helper-wrapper"
      },
      toReturn
    );
  };

  return InfoHelper;
}(Component);

export { InfoHelper as default };