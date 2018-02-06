//@flow
import React, { Component } from "react";
import { Alert } from "@blueprintjs/core";
import ReactDOM from "react-dom";

export function renderOnDoc(fn) {
  const elemDiv = document.createElement("div");
  elemDiv.style.cssText =
    "position:absolute;width:100%;height:100%;top:0px;opacity:0.3;z-index:100;";
  document.body.appendChild(elemDiv);
  const handleClose = () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(elemDiv);
      document.body.removeChild(elemDiv);
    });
  };
  return ReactDOM.render(fn(handleClose), elemDiv);
}

export default function showConfirmationDialog(opts) {
  return renderOnDoc(handleClose => {
    return <AlertWrapper {...{ ...opts, handleClose }} />;
  });
}

class AlertWrapper extends Component {
  state = { isOpen: true };
  render() {
    const {
      handleClose,
      children,
      text = "customize like --  {text: 'your text here'} ",
      onCancel = () => {},
      cancelButtonText = "Cancel",
      onConfirm = () => {},
      ...rest
    } = this.props;
    return (
      <Alert
        isOpen={this.state.isOpen}
        onCancel={(...args) => {
          handleClose();
          this.setState({ isOpen: false });
          onCancel(...args);
        }}
        cancelButtonText={cancelButtonText}
        onConfirm={(...args) => {
          handleClose();
          this.setState({ isOpen: false });
          onConfirm(...args);
        }}
        {...rest}
      >
        {children || text}{" "}
      </Alert>
    );
  }
}
