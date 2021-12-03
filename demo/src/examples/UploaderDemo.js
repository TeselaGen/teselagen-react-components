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
      <Uploader disabled={disabled}></Uploader>
    </div>
  );
};
