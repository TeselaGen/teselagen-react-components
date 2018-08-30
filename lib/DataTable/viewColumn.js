"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  width: 35,
  noEllipsis: true,
  immovable: true,
  type: "action",
  render: function render() {
    return _react2.default.createElement(_core.Icon, { className: "dt-eyeIcon", icon: "eye-open" });
  }
};
module.exports = exports["default"];