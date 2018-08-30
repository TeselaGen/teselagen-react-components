import React from "react";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";
import PropTypes from "prop-types";

function DialogFooter(_ref) {
  var _ref$hideModal = _ref.hideModal,
      hideModal = _ref$hideModal === undefined ? noop : _ref$hideModal,
      loading = _ref.loading,
      submitting = _ref.submitting,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? noop : _ref$onClick,
      secondaryAction = _ref.secondaryAction,
      _ref$intent = _ref.intent,
      intent = _ref$intent === undefined ? Intent.PRIMARY : _ref$intent,
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

  return React.createElement(
    "div",
    { className: Classes.DIALOG_FOOTER },
    React.createElement(
      "div",
      { className: Classes.DIALOG_FOOTER_ACTIONS },
      !noCancel && React.createElement(Button, {
        intent: secondaryIntent,
        minimal: true,
        className: secondaryClassName,
        text: secondaryText,
        onClick: secondaryAction || hideModal
      }),
      additionalButtons,
      React.createElement(Button, {
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
  loading: PropTypes.bool,
  submitting: PropTypes.bool,
  onClick: PropTypes.func,
  secondaryAction: PropTypes.func,
  intent: PropTypes.string,
  secondaryIntent: PropTypes.string,
  secondaryText: PropTypes.string,
  additionalButtons: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  className: PropTypes.string,
  secondaryClassName: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  noCancel: PropTypes.bool
} : {};

export default DialogFooter;