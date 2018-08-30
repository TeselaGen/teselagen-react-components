"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = WithFields;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = require("redux-form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//simple enhancer that wraps a component in a redux <Fields/> component
//all options are passed as props to <Fields/>
function WithFields(fieldsProps) {
  return function AddFieldsHOC(Component) {
    return function AddFields(props) {
      return _react2.default.createElement(_reduxForm.Fields, _extends({}, fieldsProps, props, { component: Component }));
    };
  };
}
module.exports = exports["default"];