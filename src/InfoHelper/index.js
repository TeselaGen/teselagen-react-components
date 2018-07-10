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
      displayToSide,
      style,
      ...rest
    }: Props = this.props;
    const IconToUse = isButton ? Button : Icon;
    const IconInner = (
      <IconToUse
        title="thomas"
        icon={icon}
        className={className}
        iconSize={size}
        disabled={disabled}
        {...rest}
      />
    );
    let toReturn;
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
          disabled={disabled}
          popoverClassName="pt-dark"
          target={
            <Button
              style={{ borderRadius: 15, borderWidth: 5 }}
              className={"pt-minimal " + (className || "")}
              icon={icon}
            />
          }
          content={<div style={{ padding: 5 }}>{content || children}</div>}
          {...popoverProps}
        />
      );
    } else {
      toReturn = (
        <Tooltip
          disabled={disabled}
          target={IconInner}
          content={content || children}
          {...popoverProps}
        />
      );
    }
    return (
      <div
        style={{ display: "flex", ...style }}
        className={"info-helper-wrapper"}
      >
        {toReturn}
      </div>
    );
  }
}
