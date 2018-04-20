import React from 'react';
import { getHotkeyProps } from './hotkeyUtils';
import { MenuItem } from "@blueprintjs/core";
import { startCase } from 'lodash';
import PropTypes from "prop-types";

// Enhanced MenuItem that supports history-based navigation when passed a
// `navTo` prop
export function EnhancedMenuItem({ navTo, ...props}, context)  {
  let clickHandler = props.onClick;
  if (navTo) {
    clickHandler = (e) => {
      context.router.history.push(navTo);
      if (props.onClick) props.onClick(e);
    };
  }
  return <MenuItem {...props} onClick={clickHandler} />
}

EnhancedMenuItem.contextTypes = {
  router: PropTypes.object,
};

// Populate the given menu definition with any defined hotkeys, matched using
// the `cmd` property
export const addMenuHotkeys = (menuDef, hotkeys) => walkMenu(menuDef, item => {
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
export const addMenuHandlers = (menuDef, handlers) => walkMenu(menuDef, item => {
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
