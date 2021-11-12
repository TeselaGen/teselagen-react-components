/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React from "react";
import { Button, Popover, Position } from "@blueprintjs/core";
import classnames from "classnames";
import popoverOverflowModifiers from "./utils/popoverOverflowModifiers";

function DropdownButton({ disabled, menu, noRightIcon, className, ...rest }) {
  return (
    <Popover
      minimal
      modifiers={popoverOverflowModifiers}
      disabled={disabled}
      autoFocus={false}
      content={menu}
      position={Position.BOTTOM_LEFT}
    >
      <Button
        {...rest}
        disabled={disabled}
        className={classnames(className, "dropdown-button")}
        rightIcon={noRightIcon ? undefined : "caret-down"}
      />
    </Popover>
  );
}

export default DropdownButton;
