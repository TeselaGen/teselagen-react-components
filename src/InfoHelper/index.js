//@flow
import React, { Component } from "react";
import { Popover, Button, Tooltip } from "@blueprintjs/core";

export default class Card extends Component {
  render() {
    const {
      className,
      content,
      children,
      iconName,
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
              iconName={iconName || "info-sign"}
            />
          }
          content={<div style={{ padding: 5 }}>{content || children}</div>}
        />
      );
    } else {
      return (
        <Tooltip
          target={
            <span
              style={{ ...(size ? { fontSize: size } : {}) }}
              className={
                (className || "") + " pt-icon-" + (iconName || "info-sign")
              }
            />
          }
          content={content || children}
        />
      );
    }
  }
}
