"use strict";

exports.__esModule = true;
exports.default = BlueprintError;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BlueprintError(_ref) {
  var error = _ref.error;

  if (!error) return null;
  return _react2.default.createElement(
    "div",
    { className: (0, _classnames2.default)(_core.Classes.FORM_GROUP, _core.Classes.INTENT_DANGER) },
    _react2.default.createElement(
      "div",
      { className: (0, _classnames2.default)(_core.Classes.FORM_HELPER_TEXT, "preserve-newline") },
      error
    )
  );
}
module.exports = exports["default"];