"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createMenu;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _menuUtils = require("./menuUtils");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * navTo: a url to navigate to (assumes react-router)
 * href: a url to link to
 * target: link target
 *
 * Since this function is recursive (to handle nested submenus), and React
 * elements passed as input are returned unchanged, it is possible to freely mix
 * item objects and MenuItem elements. That also makes it safe to call the function
 * with its own output.
 *
 * A customize function may also be provided, and allows customization or
 * replacement of the created MenuItems, allowing for custom props or behavior.
 * That function receives the original created element and the item object, and
 * must return an element.
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
function createMenu(_structure, customize, event, onClose) {
  var structure = filterMenuForCorrectness(_structure);

  if (!structure || !structure.length) return;

  var menuToRender = _createMenu(structure, 0, customize);
  if (event) {
    //if an event is passed then we'll render a context menu at the event's position
    _core.ContextMenu.show(_react2.default.createElement(
      _core.Menu,
      null,
      menuToRender
    ), { left: event.clientX, top: event.clientY }, onClose);
    event.stopPropagation();
    event.preventDefault();
  } else {
    return menuToRender;
  }
}

function _createMenu(input, i, customize) {
  var out = void 0;
  if (_react2.default.isValidElement(input)) {
    // Assume it's already a <MenuItem> element
    out = input;
  } else if (input instanceof Array) {
    out = input.map(function (item, i) {
      return _createMenu(item, i, customize);
    });
  } else {
    var item = input;
    var key = item.key || item.text || item.divider || i;
    if (item.divider !== undefined) {
      out = _react2.default.createElement(_core.MenuDivider, _extends({
        key: key
      }, item.divider ? { title: item.divider } : {}));
    } else {
      if (!item.key && !item.text) {
        console.warn("Menu item with no key", item);
      }
      out = _react2.default.createElement(
        _menuUtils.EnhancedMenuItem,
        _extends({
          key: key
        }, (0, _lodash.omit)(item, ["submenu", "hotkey"]), {
          icon: item.icon || item.iconName,
          labelElement: item.hotkey && _react2.default.createElement(_core.KeyCombo, { minimal: true, combo: item.hotkey }),
          text: item.text
        }),
        item.submenu ? _createMenu(item.submenu, 0, customize) : undefined
      );
    }

    if (customize) {
      out = customize(out, item);
    }

    if (item.tooltip) {
      out = _react2.default.createElement(
        _core.Tooltip,
        { key: key, content: item.tooltip },
        out
      );
    }
  }
  return out;
}

function filterMenuForCorrectness(menu) {
  return menu && menu.length && menu.filter(function (item) {
    return item;
  });
}
module.exports = exports["default"];