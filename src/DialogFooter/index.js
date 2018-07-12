import React from "react";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";

function DialogFooter({
  hideModal = noop,
  loading,
  submitting,
  onClick = noop,
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
    </div>
  );
}

export default DialogFooter;
