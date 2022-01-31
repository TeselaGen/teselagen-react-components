import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import showConfirmationDialog from "../../../src/showConfirmationDialog";
import { useToggle } from "../renderToggle";

export default function Demo() {
  const [noCancel, noCancelComp] = useToggle({
    type: "noCancelButton",
    label: "No Cancel Button"
  });
  const [withThird, withThirdComp] = useToggle({
    type: "withThirdButton",
    label: "With Third Button"
  });
  return (
    <div>
      {noCancelComp}
      {withThirdComp}
      <br></br>
      <br></br>

      <Button
        onClick={async function handleClick() {
          const confirm = await showConfirmationDialog({
            ...(withThird && {
              thirdButtonText: "Third Button",
              thirdButtonIntent: "primary"
            }),
            noCancelButton: noCancel,
            text:
              "Are you sure you want to re-run this tool? Downstream tools with linked outputs will need to be re-run as well!",
            intent: Intent.DANGER, //applied to the right most confirm button
            confirmButtonText: "Yep!",
            cancelButtonText: "Nope", //pass null to make the cancel button disappear
            // cancelButtonText: null, //pass null to make the cancel button disappear
            canEscapeKeyCancel: true //this is false by default
          });
          console.info("confirm:", confirm);
          window.toastr.success(`confirm =  ${confirm}`);
        }}
        text="Do some action"
      />
    </div>
  );
}
