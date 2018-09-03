// import Rnd from "react-rnd";
import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import Rnd from "./react-rnd";
import "./style.css";

export default function ResizableDraggableDialog({
  width: defaultDialogWidth = 400,
  height: defaultDialogHeight = 450,
  RndProps,
  ...rest
}) {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
  return (
    <div
      className={"tg-bp3-dialog-resizable-draggable"}
      style={{ top: 0, left: 0, position: "fixed" }}
    >
      <Rnd
        enableResizing={{
          bottomLeft: true,
          bottomRight: true,
          topLeft: true,
          topRight: true
        }}
        maxHeight={windowHeight}
        maxWidth={windowWidth}
        // minWidth={Math.min(defaultDialogWidth, 300) }
        // minHeight={Math.min(defaultDialogHeight, 200) }
        bounds={"window"}
        // default={{
        //   x: Math.max((windowWidth - defaultDialogWidth) / 2, 0),
        //   y: Math.max((windowHeight - defaultDialogHeight) / 2, 0),
        //   width: Math.min(defaultDialogWidth, windowWidth),
        //   height: Math.min(defaultDialogHeight, windowHeight)
        // }}
        // default={{
        //   x: "50%",
        //   y: "50%",
        // }}
        dragHandleClassName={Classes.DIALOG_HEADER}
        {...RndProps}
      >
        <Dialog hasBackdrop={false} usePortal={false} {...rest} />
      </Rnd>
    </div>
  );
}
