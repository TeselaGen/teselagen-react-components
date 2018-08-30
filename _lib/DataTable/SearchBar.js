"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _handlerHelpers = require("../utils/handlerHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchBar = function SearchBar(_ref) {
  var reduxFormSearchInput = _ref.reduxFormSearchInput,
      setSearchTerm = _ref.setSearchTerm,
      maybeSpinner = _ref.maybeSpinner,
      disabled = _ref.disabled;

  return _react2.default.createElement(_core.InputGroup, _extends({
    disabled: disabled,
    className: (0, _classnames2.default)(_core.Classes.ROUND, "datatable-search-input"),
    placeholder: "Search..."
  }, reduxFormSearchInput.input, (0, _handlerHelpers.onEnterHelper)(function (e) {
    e.preventDefault();
    setSearchTerm(reduxFormSearchInput.input.value);
  }), {
    rightElement: maybeSpinner || _react2.default.createElement(_core.Button, {
      className: _core.Classes.MINIMAL,
      icon: "search",
      onClick: function onClick() {
        setSearchTerm(reduxFormSearchInput.input.value);
      }
    })
  }));
};

exports.default = SearchBar;
module.exports = exports["default"];