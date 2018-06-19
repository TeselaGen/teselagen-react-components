import React from "react";
import { lifecycle, compose, branch } from "recompose";
import { withRouter } from "react-router-dom";
import { getHotkeyProps } from "./hotkeyUtils";
import { MenuItem } from "@blueprintjs/core";
import { startCase } from "lodash";

// Enhanced MenuItem that supports history-based navigation when passed a
// `navTo` prop
export const EnhancedMenuItem = compose(
  lifecycle({
    componentDidMount: function() {
      const { didMount = noop, className } = this.props;
      didMount({ className });
    },
    componentWillUnmount: function() {
      const { willUnmount = noop, className } = this.props;
      willUnmount({ className });
    }
  }),
  branch(({navTo}) => navTo, withRouter)
)(function({ navTo, staticContext, ...props }) {
  let clickHandler = props.onClick;
  if (navTo) {
    clickHandler = e => {
      if (e.metaKey || e.ctrlKey) {
        window.open(navTo);
      } else {
        props.history.push(navTo);
      }
      if (props.onClick) props.onClick(e);
    };
  }
  return <MenuItem {...props} onClick={clickHandler} />;
});

// Populate the given menu definition with any defined hotkeys, matched using
// the `cmd` property
export const addMenuHotkeys = (menuDef, hotkeys) =>
  walkMenu(menuDef, item => {
    const out = { ...item };
    if (item.cmd && hotkeys[item.cmd]) {
      const props = getHotkeyProps(hotkeys[item.cmd], item.cmd);
      out.text = item.text || props.label;
      out.hotkey = props.combo;
    }
    return out;
  });

// Populate the given menu definition with any defined handlers, matched using
// the `cmd` property
export const addMenuHandlers = (menuDef, handlers) =>
  walkMenu(menuDef, item => {
    const out = { ...item };
    if (item.cmd && handlers[item.cmd]) {
      out.text = item.text || startCase(item.cmd);
      out.onClick = handlers[item.cmd];
    }
    return out;
  });

// Recursively walk the given menu and run each item through func
function walkMenu(menuDef, func) {
  if (menuDef instanceof Array) {
    return menuDef.map(item => walkMenu(item, func));
  }
  const out = func(menuDef);
  if (out.submenu) {
    out.submenu = out.submenu.map(item => walkMenu(item, func));
  }
  return out;
}
const noop = () => {};
