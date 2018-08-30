var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { Hotkeys, Hotkey, HotkeysTarget } from '@blueprintjs/core';
import { startCase } from 'lodash';

// This has been mostly superseded by blueprint's KeyCombo component, but may
// still be useful for cases where we need plain text
export function comboToLabel(def) {
  var useSymbols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var combo = typeof def === "string" ? def : def.combo;

  if (useSymbols) {
    var parts = combo.replace("++", "+plus").split("+");
    parts = parts.map(function (p) {
      return symbols[p] || startCase(p);
    });
    return parts.join("");
  } else {
    return combo.split("+").map(startCase).join(" + ").replace("Mod", isMac ? "Cmd" : "Ctrl").replace("Alt", isMac ? "Option" : "Alt");
  }
}

// HOF to get hotkey combos by id
export var hotkeysById = function hotkeysById(hotkeys) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'raw';
  return function (id) {
    var def = getHotkeyProps(hotkeys[id]);
    return def && (mode === 'raw' ? def.combo : comboToLabel(def.combo, mode === 'symbols'));
  };
};

// Translate shorthand array if needed
export var getHotkeyProps = function getHotkeyProps(def, id) {
  var out = void 0;
  if (typeof def === 'string') {
    out = { combo: def };
  } else if (def instanceof Array) {
    out = _extends({ combo: def[0], label: def[1] }, def[2] || {});
  } else {
    out = def;
  }
  out.label = out.label || startCase(id);
  return out;
};

// Return a class-based component wrapping a functional one. Creates a dummy
// one if no function is passed.
var wrapperClass = function wrapperClass(funcComponent) {
  var func = funcComponent || function () {
    return React.createElement('div', null);
  };
  return function (_React$Component) {
    _inherits(FunctionalWrapper, _React$Component);

    function FunctionalWrapper() {
      _classCallCheck(this, FunctionalWrapper);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    FunctionalWrapper.prototype.render = function render() {
      return func(this.props);
    };

    return FunctionalWrapper;
  }(React.Component);
};

/*
 * HOC to add hotkey support to components. Use this instead of blueprint's one.
 *
 * Arguments:
 * - hotkeySpec: either a named hotkey section previously registered, or an
 *   object mapping command ids to hotkey definitions, where each hotkey can
 *   be either:
 *   - a string consisting in the key combo (e.g. 'ctrl+shift+x')
 *   - an array holding the combo, label, and an object with any other props
 *   - an object holding all props
 * - handlers: an object mapping command ids to handler functions
 * - options: an object that may specify the follownig options:
 *   - functional: boolean indicating if the wrapped component will be a
 *     functional stateless component instead of a class-based one
 *
 * Returns a function that can be invoked with a component class, or a
 * stateless component function (if specified in the options) and returns
 * the decorated class. It may also be invoked without arguments to generate a
 * dummy ad-hoc component with no output.
 *
 */
var withHotkeys = function withHotkeys(hotkeys, handlers) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (Component) {
    var ComponentClass = options.functional || !Component ? wrapperClass(Component) : Component;

    var Sub = function (_ComponentClass) {
      _inherits(Sub, _ComponentClass);

      function Sub() {
        _classCallCheck(this, Sub);

        return _possibleConstructorReturn(this, _ComponentClass.apply(this, arguments));
      }

      Sub.prototype.renderHotkeys = function renderHotkeys() {
        return React.createElement(
          Hotkeys,
          null,
          Object.keys(hotkeys).map(function (id) {
            var _getHotkeyProps = getHotkeyProps(hotkeys[id], id),
                props = _objectWithoutProperties(_getHotkeyProps, []);

            return React.createElement(Hotkey, _extends({}, props, {
              key: id,
              global: props.global !== false,
              onKeyDown: handlers[id]
            }));
          })
        );
      };

      return Sub;
    }(ComponentClass);

    return HotkeysTarget(Sub);
  };
};

export { withHotkeys };
var isMac = navigator.userAgent.includes("Mac OS X");

// TODO maybe avoid using symbols by default when not on Mac?
// Anyway, alternative 'Key + Key' description is provided as well
var symbols = {
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
  esc: "␛", //'⎋',
  enter: "⏎",
  backspace: "⌫",
  plus: "+",
  tab: "⇥",
  space: "␣",
  capslock: "⇪",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
  left: "←",
  right: "→",
  up: "↑",
  down: "↓"
};

symbols.mod = symbols[isMac ? "meta" : "ctrl"];