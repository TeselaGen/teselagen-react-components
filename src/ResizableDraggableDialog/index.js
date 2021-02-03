import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import { Rnd } from "react-rnd";
import "./style.css";

const defaultDialogWidth = 400;
const defaultDialogHeight = 450;
export default class ResizableDraggableDialog extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    this.setDefaults();
    setTimeout(() => {
      this.setDefaults();
    }, 0);
  }
  state = {
    x: 0,
    y: 0,
    width: defaultDialogWidth,
    height: defaultDialogHeight
  };

  setDefaults = () => {
    const { width, height } = this.props;
    const { windowWidth, windowHeight } = this.getWindowWidthAndHeight();

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

    this.setState({
      x: Math.round(Math.max((windowWidth - widthToUse) / 2, 0)),
      y: Math.round(Math.max((windowHeight - heightToUse) / 2, 0)),
      width: Math.min(widthToUse, windowWidth),
      height: Math.min(Math.max(defaultDialogHeight, heightToUse), windowHeight)
    });
  };
  onWindowResize = () => {
    this.setDefaults();
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
          bounds="window"
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position
            });
          }}
          dragHandleClassName={Classes.DIALOG_HEADER}
          {...RndProps}
        >
          <Dialog
            enforceFocus={false}
            hasBackdrop={false}
            usePortal={false}
            canEscapeKeyClose={true}
            {...rest}
          />
        </Rnd>
      </div>
    );
  }
}
