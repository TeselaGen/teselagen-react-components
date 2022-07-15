import React from "react";
import IntentText from "../../../src/IntentText";
import DemoWrapper from "../DemoWrapper";

export default function IntentTextDemo() {
  return (
    <DemoWrapper>
      <IntentText intent="primary">I am primary!</IntentText>

      <IntentText intent="success">I am success!</IntentText>

      <IntentText intent="danger">I am an error!</IntentText>

      <IntentText intent="warning">I am warning!</IntentText>
    </DemoWrapper>
  );
}
