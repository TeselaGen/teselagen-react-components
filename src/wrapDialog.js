/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { useMemo, useRef } from "react";
import { Dialog, useHotkeys } from "@blueprintjs/core";
import { noop, isFunction } from "lodash";
import { ResizableDraggableDialog } from ".";

export default (topLevelDialogProps = {}) => Component => props => {
  const r = useRef();
  const memoedHotkeys = useMemo(
    () => [
      {
        combo: "enter",
        global: true,
        onKeyDown: () => {
          try {
            const parentEl = r.current.closest(".bp3-dialog-container");
            if (!document.activeElement) return;
            //don't do this in text areas
            if (document.activeElement.type === "textarea") return;
            if (
              //don't do this if the dialog doesn't have the focus
              document.activeElement.closest(".bp3-dialog-container") ===
              parentEl
            ) {
              parentEl.querySelector(`button[type='submit']`).click();
            }
          } catch (error) {
            console.error(`error:`, error);
          }
        }
      }
    ],
    []
  );

  useHotkeys(memoedHotkeys);

  let otherTopLevelProps,
    getDialogProps = noop;
  if (isFunction(topLevelDialogProps)) {
    getDialogProps = topLevelDialogProps;
  } else {
    const {
      footerProps,
      getDialogProps: _pullOff,
      ...additionalProps
    } = topLevelDialogProps;
    otherTopLevelProps = additionalProps;
    getDialogProps = topLevelDialogProps.getDialogProps || noop;
  }
  const { dialogProps, hideModal, ...otherProps } = props;

  const extraDialogProps = {
    ...otherTopLevelProps,
    ...dialogProps,
    ...getDialogProps(props)
  };

  const DialogToUse = extraDialogProps.isDraggable
    ? ResizableDraggableDialog
    : Dialog;

  return (
    <DialogToUse
      canOutsideClickClose={false}
      isOpen
      onClose={hideModal}
      {...extraDialogProps}
      style={{ ...extraDialogProps.style }}
    >
      <div ref={r}></div>
      <Component hideModal={hideModal} {...otherProps} />
    </DialogToUse>
  );
};
