//@flow
import React from "react";
import { CollapsibleCard } from "../../../src";
import { Button } from "@blueprintjs/core";
export default function InfoHelperDemo() {
  return (
    <div>
      <CollapsibleCard
        title="Jobs"
        openTitleElements={<Button text="hey" icon="add" />}
        icon="build"
      >
        I'm some content!
      </CollapsibleCard>
    </div>
  );
}
