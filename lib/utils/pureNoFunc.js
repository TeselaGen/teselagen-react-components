"use strict";

exports.__esModule = true;

var _recompose = require("recompose");

var _lodash = require("lodash");

/**
 * This HOC compares props to create a pure component that will only update
 * when props are not deep equal. It will compare the string values of functions
 */
var isEq = function isEq(o1, o2) {
  var isEq = (0, _lodash.isEqualWith)(o1, o2, function (val1, val2) {
    if ((0, _lodash.isFunction)(val1) && (0, _lodash.isFunction)(val2)) {
      return val1 === val2 || val1.toString() === val2.toString();
    }
  });
  return isEq;
};

var pure = function pure(BaseComponent) {
  var hoc = (0, _recompose.shouldUpdate)(function (props, nextProps) {
    return !isEq(props, nextProps);
  });
  return hoc(BaseComponent);
};

exports.default = pure;
module.exports = exports["default"];