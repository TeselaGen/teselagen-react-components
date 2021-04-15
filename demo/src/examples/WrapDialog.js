import { Button, Classes, InputGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import { Provider } from "react-redux";
import wrapDialog from "../../../src/wrapDialog";
import store from "../store";

function DialogInner(p) {
  return (
    <div className={Classes.DIALOG_BODY}>
      
        I am a dialog
        <div style={{ width: 450 }}>with a bunch of stuff in it</div>
        {[1, 2, 3, 4, 5, 5, 6, 6, 77, 7, 12, 2, 34].map((num, i) => {
          return (
            <div key={i} style={{ height: 40, background: Math.random() }}>
              {num}
              {p && p.prop1}
            </div>
          );
        })}
        <InputGroup></InputGroup>
        <Button
          onClick={() => {
            console.log(`yarrrr`);
          }}
          type="submit"
        >
          Hey
        </Button>
    </div>
  );
}
const MyDialog = wrapDialog({ title: "Dialog Demo" })(DialogInner);

export default function WrapDialogDemo() {
  const [isOpen, setOpen] = useState(true);
  return (
    <Provider store={store}>
      <div>
        <MyDialog
          hideModal={() => {
            setOpen(false);
          }}
          isOpen={isOpen}
        ></MyDialog>
      </div>
    </Provider>
  );
}
