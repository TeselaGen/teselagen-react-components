import React, { Component } from "react";
import { Alert, Intent } from "@blueprintjs/core";
import { renderOnDoc } from "../utils/renderOnDoc";

// usage
// const doAction = await showConfirmationDialog({
//   text:
//     "Are you sure you want to re-run this tool? Downstream tools with linked outputs will need to be re-run as well!",
//     intent: Intent.DANGER, //applied to the right most confirm button
//     confirmButtonText: "Yep!",
//     cancelButtonText: "Nope",
//     canEscapeKeyCancel: true //this is false by default
// });
// console.info("doAction:", doAction);
//returns a promise that resolves with true or false depending on if the user cancels or not!
export default function showConfirmationDialog(opts) {
  return new Promise(resolve => {
    renderOnDoc(handleClose => {
      return <AlertWrapper {...{ ...opts, handleClose, resolve }} />;
    });
  });
}

class AlertWrapper extends Component {
  state = { isOpen: true };
  render() {
    const {
      handleClose,
      text,
      resolve,
      content,
      cancelButtonText = "Cancel",
      intent = Intent.PRIMARY,
      ...rest
    } = this.props;
    const doClose = confirm => {
      handleClose();
      this.setState({ isOpen: false });
      resolve(confirm);
    };
    return (
      <Alert
        isOpen={this.state.isOpen}
        intent={intent}
        cancelButtonText={cancelButtonText}
        onCancel={cancelButtonText ? () => doClose(false) : undefined}
        onConfirm={() => doClose(true)}
        {...rest}
      >
        {content}
        {text && <p style={{ marginBottom: 10 }}>{text}</p>}
      </Alert>
    );
  }
}
