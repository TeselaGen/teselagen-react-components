import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import { Rnd } from "react-rnd";
import uniqid from "uniqid";
import "./style.css";

export default class ResizableDraggableDialog extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    this.setState({ triggerRerender: uniqid() });
  }
  state = { triggerRerender: 1 };

  onWindowResize = () => {
    this.setState({ triggerRerender: uniqid() });
    //trigger a fake drag event here so that the dialog will stay in the window on window resize
    // const targetNode = document.querySelector(`.${Classes.DIALOG_HEADER}`);
    // if (targetNode) {
    //   //--- Simulate a natural mouse-click sequence.
    //   triggerMouseEvent(targetNode, "mouseover");
    //   triggerMouseEvent(targetNode, "mousedown");
    //   triggerMouseEvent(document, "mousemove");
    //   triggerMouseEvent(targetNode, "mouseup");
    //   triggerMouseEvent(targetNode, "click");
    // } else {
    //   console.info("*** Target node not found!");
    // }

    // function triggerMouseEvent(node, eventType) {
    //   const clickEvent = document.createEvent("MouseEvents");
    //   clickEvent.initEvent(eventType, true, true);
    //   node.dispatchEvent(clickEvent);
    // }
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
      windowHeight: windowHeight - 20 //add a small correction here
    };
  };

  render() {
    const { width, height, RndProps, ...rest } = this.props;
    const { windowWidth, windowHeight } = this.getWindowWidthAndHeight();
    const defaultDialogWidth = 400;
    const defaultDialogHeight = 450;
    let heightToUse;
    if (height) {
      heightToUse = height;
    } else {
      heightToUse = (document.querySelector(".bp3-dialog-body") || {})
        .scrollHeight;
      if (heightToUse) {
        heightToUse = heightToUse + 60;
      } else {
        heightToUse = defaultDialogHeight;
      }
    }
    let widthToUse;
    if (width) {
      widthToUse = width;
    } else {
      widthToUse = defaultDialogWidth;
    }

    return (
      <div
        className="tg-bp3-dialog-resizable-draggable"
        style={{ top: 0, left: 0, position: "fixed" }}
      >
        <Rnd
          key={this.state.triggerRerender}
          enableResizing={{
            bottomLeft: true,
            bottomRight: true,
            topLeft: true,
            topRight: true
          }}
          maxHeight={windowHeight}
          maxWidth={windowWidth}
          bounds="window"
          default={{
            x: Math.round(Math.max((windowWidth - widthToUse) / 2, 0)),
            y: Math.round(Math.max((windowHeight - heightToUse) / 2, 0)),
            width: Math.min(widthToUse, windowWidth),
            height: Math.min(
              Math.max(defaultDialogHeight, heightToUse),
              windowHeight
            )
          }}
          // default={{ //tnrtodo - implement this once strml merges my pr..
          //   x: "50%",
          //   y: "50%",
          // }}
          dragHandleClassName={Classes.DIALOG_HEADER}
          {...RndProps}
        >
          <Dialog
            canEscapeKeyClose={true}
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
