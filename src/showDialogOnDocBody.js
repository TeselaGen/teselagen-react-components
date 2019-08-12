import ReactDOM from "react-dom";
import React from "react";
import uniqid from "uniqid";

//this is only really useful for unconnected standalone simple dialogs
//remember to pass usePortal={false} to the <Dialog/> component so it will close properly
export default function showDialogOnDocBody(DialogComp, props) {
  const dialogHolder = document.createElement("div");
  const className = "myDialog" + uniqid();
  dialogHolder.className = className;
  document.body.appendChild(dialogHolder);

  ReactDOM.render(
    <DialogComp
      hideModal={() => {
        document.querySelector("." + className).remove();
      }}
      {...props}
    />,
    dialogHolder
  );
}
