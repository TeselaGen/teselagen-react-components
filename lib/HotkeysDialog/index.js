"use strict";

exports.__esModule = true;
exports.default = HotkeysDialog;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _hotkeyUtils = require("../utils/hotkeyUtils");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HotkeysDialog(props) {
  if (!props.hotkeySets) {
    console.error("Missing hotkeySets in HotkeysDialog");
    return null;
  }
  var sections = Object.keys(props.hotkeySets);
  return _react2.default.createElement(
    _core.Dialog,
    {
      icon: "heat-grid",
      isOpen: props.isOpen,
      onClose: props.onClose,
      title: "Keyboard Shortcuts"
    },
    _react2.default.createElement(
      _core.Tabs,
      { className: "tg-hotkeys-dialog" },
      sections.map(function (name) {
        return _react2.default.createElement(_core.Tab, {
          key: name,
          id: name,
          title: name,
          panel: _react2.default.createElement(
            "div",
            { className: "tg-table-wrapper" },
            _react2.default.createElement(
              "table",
              {
                className: (0, _classnames2.default)(_core.Classes.HTML_TABLE, _core.Classes.HTML_TABLE_STRIPED, _core.Classes.HTML_TABLE_BORDERED)
              },
              _react2.default.createElement(
                "thead",
                null,
                _react2.default.createElement(
                  "tr",
                  null,
                  _react2.default.createElement(
                    "th",
                    null,
                    "Action"
                  ),
                  _react2.default.createElement(
                    "th",
                    null,
                    "Shortcut"
                  )
                )
              ),
              _react2.default.createElement(
                "tbody",
                null,
                Object.keys(props.hotkeySets[name]).map(function (id) {
                  var def = (0, _hotkeyUtils.getHotkeyProps)(props.hotkeySets[name][id], id);
                  return _react2.default.createElement(
                    "tr",
                    { key: id },
                    _react2.default.createElement(
                      "td",
                      null,
                      def.label
                    ),
                    _react2.default.createElement(
                      "td",
                      null,
                      _react2.default.createElement(_core.KeyCombo, { combo: def.combo })
                    )
                  );
                })
              )
            )
          )
        });
      })
    )
  );
}
// import { startCase } from "lodash";
module.exports = exports["default"];