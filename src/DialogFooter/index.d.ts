/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";

/**
 * @example
 * <DialogFooter
    text="Next"
    submitting={submitting}
    onClick={handleSubmit(onSubmit)}
  />
  @example
  <DialogFooter
    onBackClick={() => {}}
    hideModal={hideModal}
    submitting={submitting}
    onClick={handleSubmit(onSubmit)}
  />
 */
function DialogFooter({
  hideModal = noop,
  loading,
  onBackClick,
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
  return "";
}

export default DialogFooter;
