"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var itemUpload = function itemUpload(props) {
  var item = props.item;
  var name = nameShortener(item.name);

  return _react2.default.createElement(
    "div",
    { className: "item-upload-container", key: item.id },
    _react2.default.createElement(
      "div",
      { className: "item-upload" },
      _react2.default.createElement(
        "div",
        null,
        !props.saved ? _react2.default.createElement(
          _core.Tooltip,
          {
            content: _react2.default.createElement(
              "span",
              null,
              "Click to\n              " + (props.active ? "abort this uploading" : "remove this file")
            ),
            position: _core.Position.LEFT,
            usePortal: true
          },
          _react2.default.createElement(_core.Button, {
            intent: _core.Intent.DANGER,
            minimal: true,
            icon: "delete",
            onClick: props.onCancel
          })
        ) : null
      ),
      _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "span",
          null,
          name
        )
      ),
      _react2.default.createElement(
        "div",
        null,
        props.active ? props.value + "%" : null,
        props.error ? _react2.default.createElement(
          _core.Tooltip,
          { content: props.error, usePortal: true },
          _react2.default.createElement(_core.Icon, { icon: "error", intent: _core.Intent.DANGER })
        ) : null,
        props.saved ? _react2.default.createElement(
          _core.Tooltip,
          { content: "File Saved", usePortal: true },
          _react2.default.createElement(_core.Icon, { icon: "saved", intent: _core.Intent.SUCCESS })
        ) : null
      )
    ),
    props.active ? _react2.default.createElement(_core.ProgressBar, { intent: _core.Intent.PRIMARY, value: props.value / 100 }) : null
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

exports.default = itemUpload;
module.exports = exports["default"];