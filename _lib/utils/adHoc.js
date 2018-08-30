"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _recompose = require("recompose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//adHoc allows you to add dynamic HOCs to a component
exports.default = function (func) {
  return function (WrappedComponent) {
    return function (props) {
      var calledFunc = func(props);
      var composeArgs = Array.isArray(calledFunc) ? calledFunc : [calledFunc];
      var ComposedAndWrapped = _recompose.compose.apply(undefined, composeArgs)(WrappedComponent);
      return _react2.default.createElement(ComposedAndWrapped, props);
    };
  };
};

module.exports = exports["default"];