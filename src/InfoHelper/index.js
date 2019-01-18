//@flow
import React, { Component } from "react";
import { Popover, Button, Tooltip, Icon } from "@blueprintjs/core";

export default class InfoHelper extends Component {
  render() {
    const {
      className,
      content,
      children,
      icon = "info-sign",
      isPopover,
      isButton,
      size,
      popoverProps = {},
      disabled,
      noPopoverSizing,
      displayToSide,
      style,
      ...rest
    }: Props = this.props;
    const IconToUse = isButton ? Button : Icon;
    const IconInner = (
      <IconToUse
        icon={icon}
        className={className}
        iconSize={size}
        disabled={disabled}
        {...rest}
      />
    );
    let toReturn;
    const toolTipOrPopoverProps = {
      disabled: disabled,
      popoverClassName: !noPopoverSizing && " bp3-popover-content-sizing",
      content: content || children,
      ...popoverProps
    };
    if (displayToSide) {
      toReturn = (
        <React.Fragment>
          {IconInner}
          <span style={{ paddingLeft: 5, fontStyle: "italic" }}>
            {content || children}
          </span>
        </React.Fragment>
      );
    } else if (isPopover) {
      toReturn = (
        <Popover
          {...toolTipOrPopoverProps}
          target={
            <Button
              style={{ borderRadius: 15, borderWidth: 5 }}
              minimal
              className={className}
              icon={icon}
            />
          }
        />
      );
    } else {
      toReturn = <Tooltip {...toolTipOrPopoverProps} target={IconInner} />;
    }
    return (
      <div
        style={{ display: "flex", ...style }}
        className="info-helper-wrapper"
      >
        {toReturn}
      </div>
    );
  }
}
