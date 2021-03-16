/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React from "react";
import { Dialog } from "@blueprintjs/core";
import { noop, isFunction } from "lodash";
import { ResizableDraggableDialog } from ".";

export default (topLevelDialogProps = {}) => Component => props => {
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
    >
      <Component hideModal={hideModal} {...otherProps} />
    </DialogToUse>
  );
};
