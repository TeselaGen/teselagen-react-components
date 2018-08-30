var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from "react";
import { lifecycle, compose, branch } from "recompose";
import { withRouter } from "react-router-dom";
import { getHotkeyProps } from "./hotkeyUtils";
import { MenuItem } from "@blueprintjs/core";
import { startCase } from "lodash";

// Enhanced MenuItem that supports history-based navigation when passed a
// `navTo` prop
var EnhancedMenuItem = compose(lifecycle({
  componentDidMount: function componentDidMount() {
    var _props = this.props,
        _props$didMount = _props.didMount,
        didMount = _props$didMount === undefined ? noop : _props$didMount,
        className = _props.className;

    didMount({ className: className });
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props2 = this.props,
        _props2$willUnmount = _props2.willUnmount,
        willUnmount = _props2$willUnmount === undefined ? noop : _props2$willUnmount,
        className = _props2.className;

    willUnmount({ className: className });
  }
}), branch(function (_ref) {
  var navTo = _ref.navTo;
  return navTo;
}, withRouter))(function (_ref2) {
  var navTo = _ref2.navTo,
      staticContext = _ref2.staticContext,
      props = _objectWithoutProperties(_ref2, ["navTo", "staticContext"]);

  var clickHandler = props.onClick;
  if (navTo) {
    clickHandler = function clickHandler(e) {
      if (e.metaKey || e.ctrlKey) {
        window.open(navTo);
      } else {
        props.history.push(navTo);
      }
      if (props.onClick) props.onClick(e);
    };
  }
  return React.createElement(MenuItem, _extends({}, props, { onClick: clickHandler }));
});

// Populate the given menu definition with any defined hotkeys, matched using
// the `cmd` property
export { EnhancedMenuItem };
export var addMenuHotkeys = function addMenuHotkeys(menuDef, hotkeys) {
  return walkMenu(menuDef, function (item) {
    var out = _extends({}, item);
    if (item.cmd && hotkeys[item.cmd]) {
      var props = getHotkeyProps(hotkeys[item.cmd], item.cmd);
      out.text = item.text || props.label;
      out.hotkey = props.combo;
    }
    return out;
  });
};

// Populate the given menu definition with any defined handlers, matched using
// the `cmd` property
export var addMenuHandlers = function addMenuHandlers(menuDef, handlers) {
  return walkMenu(menuDef, function (item) {
    var out = _extends({}, item);
    if (item.cmd && handlers[item.cmd]) {
      out.text = item.text || startCase(item.cmd);
      out.onClick = handlers[item.cmd];
    }
    return out;
  });
};

// Recursively walk the given menu and run each item through func
function walkMenu(menuDef, func) {
  if (menuDef instanceof Array) {
    return menuDef.map(function (item) {
      return walkMenu(item, func);
    });
  }
  var out = func(menuDef);
  if (out.submenu) {
    out.submenu = out.submenu.map(function (item) {
      return walkMenu(item, func);
    });
  }
  return out;
}
var noop = function noop() {};