//@flow
import React from "react";
import { InfoPopover } from "../../../src";
export default function InfoPopoverDemo() {
    return <div>
      <InfoPopover message={"Hey I'm some helpful info!"}/>
      <InfoPopover size={45} message={"Hey I'm some helpful info!"}/>
    </div>
}