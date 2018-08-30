"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTable = require("react-table");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoadingComponent = _reactTable.ReactTableDefaults.LoadingComponent;


function DisabledLoadingComponent(_ref) {
  var disabled = _ref.disabled,
      loading = _ref.loading,
      loadingText = _ref.loadingText;

  return _react2.default.createElement(LoadingComponent, {
    className: disabled ? "disabled" : "",
    loading: loading,
    loadingText: disabled ? "" : loadingText
  });
}

exports.default = DisabledLoadingComponent;
module.exports = exports["default"];