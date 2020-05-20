import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import { Rnd } from "react-rnd";
import "./style.css";

export default class ResizableDraggableDialog extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    //trigger a fake drag event here so that the dialog will stay in the window on window resize
    const targetNode = document.querySelector(`.${Classes.DIALOG_HEADER}`);
    if (targetNode) {
      //--- Simulate a natural mouse-click sequence.
      triggerMouseEvent(targetNode, "mouseover");
      triggerMouseEvent(targetNode, "mousedown");
      triggerMouseEvent(document, "mousemove");
      triggerMouseEvent(targetNode, "mouseup");
      triggerMouseEvent(targetNode, "click");
    } else {
      // eslint-disable-next-line no-console
      console.log("*** Target node not found!");
    }

    function triggerMouseEvent(node, eventType) {
      const clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent(eventType, true, true);
      node.dispatchEvent(clickEvent);
    }
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  getWindowWidthAndHeight = () => {
    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
      windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
    return {
      windowWidth,
      windowHeight
    };
  };

  render() {
    const {
      width: defaultDialogWidth = 400,
      height: defaultDialogHeight = 450,
      RndProps,
      ...rest
    } = this.props;
    const { windowWidth, windowHeight } = this.getWindowWidthAndHeight();

    return (
      <div
        className="tg-bp3-dialog-resizable-draggable"
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
          bounds="window"
          default={{
            x: Math.round(Math.max((windowWidth - defaultDialogWidth) / 2, 0)),
            y: Math.round(
              Math.max((windowHeight - defaultDialogHeight) / 2, 0)
            ),
            width: Math.min(defaultDialogWidth, windowWidth),
            height: Math.min(defaultDialogHeight, windowHeight)
          }}
          // default={{ //tnrtodo - implement this once strml merges my pr..
          //   x: "50%",
          //   y: "50%",
          // }}
          dragHandleClassName={Classes.DIALOG_HEADER}
          {...RndProps}
        >
          <Dialog
            enforceFocus={false}
            hasBackdrop={false}
            usePortal={false}
            {...rest}
          />
        </Rnd>
      </div>
    );
  }
}
