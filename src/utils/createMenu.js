import React from "react";
import { MenuDivider, Tooltip, MenuItem, KeyCombo } from "@blueprintjs/core";
import { omit } from "lodash";

/**
 * Creates the contents of a Blueprint menu based on a given menu structure.
 *
 * The input can be an array of item objects, where each may contain:
 * text: text to show
 * key: React key to use (optional)
 * divider: indicates it's a divider instead of an item. Use an empty string
 *   for a normal divider, or some label text for a labeled one
 * icon: name of icon to show (optional)
 * label: right-aligned label, used mostly for shortcuts (optional)
 * hotkey: right-aligned label formatted with <KeyCombo> (optional)
 * tooltip: tooltip text to use (optional)
 * submenu: nested menu structure describing submenu (i.e. array of item objects),
 *   or array of MenuItem elements
 * onClick: click handler
 *
 * Since this function is recursive (to handle nested submenus), and React
 * elements passed as input are returned unchanged, it is possible to freely mix
 * item objects and MenuItem elements. That also makes it safe to call the function
 * with its own output.
 *
 * A customize function may also be provided, and allows customization or
 * replacement of the created MenuItems, allowing for custom props or behavior
 * (e.g. supporting a `linkTo` prop). That function receives the original
 * created element and the item object, and must return an element.
 *
 * Usage example:
 *
 * const menu = createMenu([
 *   { text: 'Item One', icon: 'add', onClick: () => console.log('Clicked 1') },
 *   { text: 'Item One', onClick: () => console.log('Clicked 2') },
 *   { divider: '' },
 *   { text: 'Item Three', icon: 'numerical', onClick: () => console.log('Clicked 3') },
 *   { divider: '' },
 *   { text: 'Submenus', submenu: [
 *     { text: 'Sub One' },
 *     { text: 'Sub Two' },
 *   ]},
 * ]);
 *
 */
export default function createMenu(input, i, customize) {
  let out;
  if (React.isValidElement(input)) {
    // Assume it's already a <MenuItem> element
    out = input;
  } else if (input instanceof Array) {
    out = input.map((item, i) => createMenu(item, i, customize));
  } else {
    const item = input;
    const key = item.key || item.text || item.divider || i;
    if (item.divider !== undefined) {
      out = (
        <MenuDivider
          key={key}
          {...(item.divider ? { title: item.divider } : {})}
        />
      );
    } else {
      if (!item.key && !item.text) {
        console.warn("Menu item with no key", item);
      }
      out = (
        <MenuItem
          key={key}
          {...omit(item, ["submenu", "hotkey"])}
          icon={item.icon || item.iconName}
          labelElement={item.hotkey && <KeyCombo minimal combo={item.hotkey} />}
          text={item.text}
        >
          {item.submenu ? createMenu(item.submenu, 0, customize) : undefined}
        </MenuItem>
      );
    }

    if (customize) {
      out = customize(out, item);
    }

    if (item.tooltip) {
      out = (
        <Tooltip key={key} content={item.tooltip}>
          {out}
        </Tooltip>
      );
    }
  }
  return out;
}
