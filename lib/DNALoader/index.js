"use strict";

exports.__esModule = true;
exports.default = DNALoader;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DNALoader(_ref) {
  var style = _ref.style,
      className = _ref.className;

  return _react2.default.createElement(
    "div",
    { className: (0, _classnames2.default)("dna-loader", className), style: style },
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" }),
    _react2.default.createElement("div", { className: "nucleobase" })
  );
}
module.exports = exports["default"];