import React from "react";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";
import PropTypes from "prop-types";
import BlueprintError from "../BlueprintError";
import "./style.css";

function DialogFooter({
  hideModal = noop,
  loading,
  submitting,
  onClick = noop,
  error,
  secondaryAction,
  intent = Intent.PRIMARY,
  secondaryIntent,
  secondaryText = "Cancel",
  additionalButtons,
  className,
  secondaryClassName = "",
  text = "Submit",
  disabled,
  noCancel
}) {
  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        {!noCancel && (
          <Button
            intent={secondaryIntent}
            minimal
            className={secondaryClassName}
            text={secondaryText}
            onClick={secondaryAction || hideModal}
          />
        )}
        {additionalButtons}
        <Button
          text={text}
          intent={intent}
          type="submit"
          className={className}
          onClick={onClick}
          disabled={disabled}
          loading={loading || submitting}
        />
      </div>
      {error && (
        <div className="tg-dialog-footer-error">
          <BlueprintError error={error} />
        </div>
      )}
    </div>
  );
}

DialogFooter.propTypes = {
  hideModal: function(props, propName, componentName) {
    if (!props.secondaryAction && !props.noCancel && !props.hideModal) {
      return new Error(`hideModal was not passed to ${componentName}`);
    }
  },
  loading: PropTypes.bool,
  submitting: PropTypes.bool,
  onClick: PropTypes.func,
  secondaryAction: PropTypes.func,
  intent: PropTypes.string,
  secondaryIntent: PropTypes.string,
  secondaryText: PropTypes.string,
  additionalButtons: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  className: PropTypes.string,
  secondaryClassName: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  noCancel: PropTypes.bool
};

export default DialogFooter;
