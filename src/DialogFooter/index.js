/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { useRef } from "react";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";
import classNames from "classnames";

function DialogFooter({
  hideModal,
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
  containerClassname,
  noCancel
}) {
  const r = useRef();
  return (
    <div
      ref={r}
      className={classNames(Classes.DIALOG_FOOTER, containerClassname)}
    >
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
            onClick={
              secondaryAction ||
              hideModal ||
              function() {
                r.current
                  .closest(".bp3-dialog")
                  .querySelector(".bp3-dialog-close-button")
                  ?.click();
              }
            }
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
