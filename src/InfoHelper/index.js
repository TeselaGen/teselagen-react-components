//@flow
import React, { Component } from "react";
import { Popover, Button, Tooltip, Icon } from "@blueprintjs/core";
import classnames from "classnames";

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
      isInline,
      clickable,
      color,
      popoverProps = {},
      disabled,
      noPopoverSizing,
      displayToSide,
      style,
      ...rest
    }: Props = this.props;
    const IconToUse = isButton ? Button : Icon;
    const iconProps = {
      icon,
      color,
      className,
      disabled
    };
    if (!isButton) iconProps.iconSize = size;

    const IconInner = <IconToUse {...iconProps} {...rest} />;
    let toReturn;
    const toolTipOrPopoverProps = {
      disabled: disabled,
      popoverClassName:
        isPopover && !noPopoverSizing && " bp3-popover-content-sizing",
      content: content || children,
      modifiers: {
        preventOverflow: { enabled: false },
        hide: {
          enabled: false
        },
        flip: {
          boundariesElement: "viewport"
        }
      },
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
      toReturn = <Popover {...toolTipOrPopoverProps} target={IconInner} />;
    } else {
      toReturn = <Tooltip {...toolTipOrPopoverProps} target={IconInner} />;
    }
    const El = isInline ? "span" : "div";
    return (
      <El
        style={{
          ...(clickable ? { cursor: "pointer" } : {}),
          ...(isInline ? {} : { display: "flex" }),
          ...style
        }}
        className={classnames("info-helper-wrapper", className)}
      >
        {toReturn}
      </El>
    );
  }
}
