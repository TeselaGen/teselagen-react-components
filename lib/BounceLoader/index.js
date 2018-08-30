"use strict";

exports.__esModule = true;
exports.default = BounceLoader;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BounceLoader(_ref) {
  var style = _ref.style,
      className = _ref.className;

  return _react2.default.createElement(
    "div",
    { className: (0, _classnames2.default)("tg-bounce-loader", className), style: style },
    _react2.default.createElement("div", { className: "rect1" }),
    _react2.default.createElement("div", { className: "rect2" }),
    _react2.default.createElement("div", { className: "rect3" }),
    _react2.default.createElement("div", { className: "rect4" }),
    _react2.default.createElement("div", { className: "rect5" })
  );
} /* taken from http://tobiasahlin.com/spinkit/ */
module.exports = exports["default"];