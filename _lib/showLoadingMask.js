"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = showLoadingMask;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Loading = require("./Loading");

var _Loading2 = _interopRequireDefault(_Loading);

var _renderOnDoc = require("./utils/renderOnDoc");

var _FillWindow = require("./FillWindow");

var _FillWindow2 = _interopRequireDefault(_FillWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showLoadingMask() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (0, _renderOnDoc.renderOnDocSimple)(_react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(_FillWindow2.default, { containerStyle: { background: "grey", opacity: .5 } }),
    _react2.default.createElement(
      _FillWindow2.default,
      { containerStyle: { opacity: 1, background: "none" } },
      function (_ref) {
        var width = _ref.width,
            height = _ref.height;

        return _react2.default.createElement(
          "div",
          { style: { width: width, height: height } },
          _react2.default.createElement(_Loading2.default, _extends({
            displayInstantly: true,
            containerStyle: {
              opacity: 1,
              display: "flex",
              justifyContent: "center"
            }
          }, opts)),
          ")"
        );
      }
    )
  ));
}
module.exports = exports["default"];