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
      style,
      ...rest
    }: Props = this.props;
    const IconToUse = isButton ? Button : Icon;
    let toReturn;
    if (isPopover) {
      toReturn = (
        <Popover
          popoverClassName="pt-dark"
          target={
            <Button
              style={{ borderRadius: 15, borderWidth: 5 }}
              className={"pt-minimal " + (className || "")}
              icon={icon}
            />
          }
          content={<div style={{ padding: 5 }}>{content || children}</div>}
        />
      );
    } else {
      toReturn = (
        <Tooltip
          target={
            <IconToUse
              icon={icon}
              className={className}
              iconSize={size}
              {...rest}
            />
          }
          content={content || children}
        />
      );
    }
    return <div className={'info-helper-wrapper'} style={style}>{toReturn}</div>;
  }
}
