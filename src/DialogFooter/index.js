/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React from "react";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";

function DialogFooter({
  hideModal = noop,
  loading,
  submitting,
  onBackClick,
  onClick = noop,
  secondaryAction,
  intent = Intent.PRIMARY,
  secondaryIntent,
  backText = "Back",
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
        {onBackClick && (
          <Button
            // intent={secondaryIntent}
            className={Classes.MINIMAL + " " + secondaryClassName}
            text={backText}
            onClick={onBackClick}
          />
        )}
        {!noCancel && (
          <Button
            intent={secondaryIntent}
            className={Classes.MINIMAL + " " + secondaryClassName}
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
