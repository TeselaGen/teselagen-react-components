import React from "react";
import { Icon, Popover } from "@blueprintjs/core";
// import { Popover2 } from "@blueprintjs/labs";
export default function InfoPopover({
  message,
  size = 20,
  iconProps,
  popoverProps
}) {
  return (
    <Popover
      content={
        <div
          style={{ margin: 10, background: "white" }}
          className={"tg-info-popover-body"}
        >
          {message}
        </div>
      }
      target={
        <Icon style={{ fontSize: size }} iconName="help" {...iconProps} />
      }
      {...popoverProps}
    />
  );
}
