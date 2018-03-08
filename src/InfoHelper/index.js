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
      size
    }: Props = this.props;
    if (isPopover) {
      return (
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
      return (
        <Tooltip
          target={<Icon icon={icon} className={className} iconSize={size} />}
          content={content || children}
        />
      );
    }
  }
}
