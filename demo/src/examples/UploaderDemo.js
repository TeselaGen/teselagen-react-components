import React from "react";
import Uploader from "../../../src/FormComponents/Uploader";
import { useToggle } from "../renderToggle";

export default () => {
  const [disabled, disabledToggleComp] = useToggle({
    type: "disabled"
  });
  return (
    <div>
      {disabledToggleComp}
      <Uploader
        onChange={() => {
          window.toastr.success("File uploaded!");
        }}
        disabled={disabled}
      ></Uploader>
    </div>
  );
};
