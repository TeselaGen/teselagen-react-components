import React from "react";
import { Button } from "@blueprintjs/core";
import withDialog from "../../../src/enhancers/withDialog";

function Dialog() {
  return <div className="pt-dialog-body">I am a dialog</div>;
}

const WithDialog = withDialog({ title: "Dialog Demo" })(Dialog);

export default function WithDialogDemo() {
  return (
    <WithDialog>
      <Button text="Show Dialog" />
    </WithDialog>
  );
}
