//@flow
import React from "react";
import { InfoHelper } from "../../../src";
export default function InfoHelperDemo() {
  return (
    <div>
      Default:
      <br />
      <InfoHelper content={"Hey I'm some helpful info!"} />
      <br />
      size=45
      <br />
      <InfoHelper size={45} content={"Hey I'm some helpful info!"} />
      <br />
      isPopover=true
      <br />
      <InfoHelper isPopover content={"Hey I'm some helpful info!"} />
      <br />
      isPopover=true
      size=30 (doesn't work)
      <br />
      <InfoHelper size={30}  isPopover content={"Hey I'm some helpful info!"} />
      <br />
      isPopover=true
      className={'pt-large'}
      <br />
      <InfoHelper className={'pt-large'} isPopover content={"Hey I'm some helpful info!"} />
      <br />
    </div>
  );
}
