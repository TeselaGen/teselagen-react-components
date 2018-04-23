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
      displayToSide,
      style,
      ...rest
    }: Props = this.props;
    const IconToUse = isButton ? Button : Icon;
    const IconInner = (
      <IconToUse icon={icon} className={className} iconSize={size} {...rest} />
    );
    let toReturn;
    if (displayToSide) {
      toReturn = (
        <React.Fragment>
          {IconInner}
          <span style={{paddingLeft: 5}}>{content || children}</span>
        </React.Fragment>
      );
    } else if (isPopover) {
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
      toReturn = <Tooltip target={IconInner} content={content || children} />;
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
