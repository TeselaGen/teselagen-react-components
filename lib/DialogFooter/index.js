"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _lodash = require("lodash");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DialogFooter(_ref) {
  var _ref$hideModal = _ref.hideModal,
      hideModal = _ref$hideModal === undefined ? _lodash.noop : _ref$hideModal,
      loading = _ref.loading,
      submitting = _ref.submitting,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? _lodash.noop : _ref$onClick,
      secondaryAction = _ref.secondaryAction,
      _ref$intent = _ref.intent,
      intent = _ref$intent === undefined ? _core.Intent.PRIMARY : _ref$intent,
      secondaryIntent = _ref.secondaryIntent,
      _ref$secondaryText = _ref.secondaryText,
      secondaryText = _ref$secondaryText === undefined ? "Cancel" : _ref$secondaryText,
      additionalButtons = _ref.additionalButtons,
      className = _ref.className,
      _ref$secondaryClassNa = _ref.secondaryClassName,
      secondaryClassName = _ref$secondaryClassNa === undefined ? "" : _ref$secondaryClassNa,
      _ref$text = _ref.text,
      text = _ref$text === undefined ? "Submit" : _ref$text,
      disabled = _ref.disabled,
      noCancel = _ref.noCancel;

  return _react2.default.createElement(
    "div",
    { className: _core.Classes.DIALOG_FOOTER },
    _react2.default.createElement(
      "div",
      { className: _core.Classes.DIALOG_FOOTER_ACTIONS },
      !noCancel && _react2.default.createElement(_core.Button, {
        intent: secondaryIntent,
        minimal: true,
        className: secondaryClassName,
        text: secondaryText,
        onClick: secondaryAction || hideModal
      }),
      additionalButtons,
      _react2.default.createElement(_core.Button, {
        text: text,
        intent: intent,
        type: "submit",
        className: className,
        onClick: onClick,
        disabled: disabled,
        loading: loading || submitting
      })
    )
  );
}

DialogFooter.propTypes = process.env.NODE_ENV !== "production" ? {
  hideModal: function hideModal(props, propName, componentName) {
    if (!props.secondaryAction && !props.noCancel && !props.hideModal) {
      return new Error("hideModal was not passed to " + componentName);
    }
  },
  loading: _propTypes2.default.bool,
  submitting: _propTypes2.default.bool,
  onClick: _propTypes2.default.func,
  secondaryAction: _propTypes2.default.func,
  intent: _propTypes2.default.string,
  secondaryIntent: _propTypes2.default.string,
  secondaryText: _propTypes2.default.string,
  additionalButtons: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)]),
  className: _propTypes2.default.string,
  secondaryClassName: _propTypes2.default.string,
  text: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  noCancel: _propTypes2.default.bool
} : {};

exports.default = DialogFooter;
module.exports = exports["default"];