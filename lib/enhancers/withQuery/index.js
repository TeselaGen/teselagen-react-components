"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withQuery;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _withQuery2 = require("./withQuery");

var _withQuery3 = _interopRequireDefault(_withQuery2);

var _Loading = require("../../Loading");

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withQuery(fragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  //passing a default LoadingComponent to withQuery
  return (0, _withQuery3.default)(fragment, _extends({}, options, {
    LoadingComp: function LoadingComp(props) {
      return _react2.default.createElement(_Loading2.default, props);
    }
  }));
}
module.exports = exports["default"];