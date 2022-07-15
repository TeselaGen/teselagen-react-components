import React from "react";
import Uploader from "../../../src/FormComponents/Uploader";
import DemoWrapper from "../DemoWrapper";
import OptionsSection from "../OptionsSection";
import { useToggle } from "../renderToggle";

export default function UploaderDemo() {
  const [disabled, disabledToggleComp] = useToggle({
    type: "disabled"
  });
  return (
    <div>
      <OptionsSection>{disabledToggleComp}</OptionsSection>
      <DemoWrapper>
        <Uploader
          onChange={() => {
            window.toastr.success("File uploaded!");
          }}
          disabled={disabled}
        />
      </DemoWrapper>
    </div>
  );
}
