// import Rnd from "react-rnd";
import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import Rnd from "react-rnd";
import "./style.css";

export default class ResizableDraggableDialog extends React.Component {
  constructor(props) {
    super(props);
    const {
      width: defaultDialogWidth = 400,
      height: defaultDialogHeight = 450
    } = this.props;
    const { windowWidth, windowHeight } = this.getWindowWidthAndHeight();
    this.state = {
      x: Math.round(Math.max((windowWidth - defaultDialogWidth) / 2, 0)),
      y: Math.round(Math.max((windowHeight - defaultDialogHeight) / 2, 0))
    };
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

  onDragStop = (e, d) => {
    this.setState({ x: Math.round(d.x), y: Math.round(d.y) });
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
          onDragStop={this.onDragStop}
          position={{ x: this.state.x, y: this.state.y }}
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
