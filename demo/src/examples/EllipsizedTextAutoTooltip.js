import { Button } from "@blueprintjs/core";
import React from "react";
import DemoWrapper from "../DemoWrapper";

export default function EllipsizedTextAutoTooltip() {
  return (
    <div>
      <DemoWrapper>
        <h5>Set a data-tip attribute:</h5>

        <code>{`<Button data-tip="I'm a tooltip">`}</code>
        <Button data-tip="I'm a tooltip">Hover me!</Button>
      </DemoWrapper>
      <br></br>
      <DemoWrapper>
        <h5>
          Or, set the following CSS styles on an element to get the following{" "}
          <br></br>
          tooltip auto-magically whenever text gets ellispized:{" "}
        </h5>
        <code>
          {`
//css-in-js
width: 190,
overflow: "hidden",
whiteSpace: "nowrap",
textOverflow: "ellipsis"`}
        </code>
        <code>
          {`
# pure css
width: 190,
overflow: "hidden",
whiteSpace: "nowrap",
textOverflow: "ellipsis"`}
        </code>
        <br></br>
        <br></br>
        <br></br>
        <div
          style={{
            width: 190,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }}
        >
          Hover me, I'm some long ellipsized text lalasdlfasdflkajsdfl I'm some
          long ellipsized text lalasdlfasdflkajsdflI'm some long ellipsized text
          lalasdlfasdflkajsdflI'm some long ellipsized text
          lalasdlfasdflkajsdflI'm some long ellipsized text lalasdlfasdflkajsdfl
        </div>
      </DemoWrapper>
    </div>
  );
}
