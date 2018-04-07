import React from "react";
import "./style.css";
import { Popover, Position, Menu, Button } from "@blueprintjs/core";
import createMenu from "../utils/createMenu";

export default class MenuBar extends React.Component {
  static defaultProps = {
    className: "",
    style: {}
  };

  state = { isOpen: false, openIndex: null };

  handleInteraction = index => newOpenState => {
    this.setState({
      isOpen: newOpenState,
      openIndex: newOpenState ? index : null
    });
  };
  handleMouseOver = index => () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({
        openIndex: index
      });
    }
  };

  render() {
    const { className, style, menu, extraContent } = this.props;
    const { isOpen, openIndex } = this.state;
    return (
      <div className={"menu-bar " + className} style={style}>
        {menu.map((topLevelItem, i) => {
          const button = (
            <Button
              key={i}
              className="pt-minimal menu-bar-item"
              onClick={topLevelItem.onClick}
              onMouseOver={this.handleMouseOver(i)}
            >
              {topLevelItem.text}
            </Button>
          );
          return !topLevelItem.submenu ? (
            button
          ) : (
            <Popover
              key={i}
              className="pt-minimal"
              portalClassName="menu-bar-popover"
              position={Position.BOTTOM_LEFT}
              isOpen={isOpen && i === openIndex}
              onInteraction={this.handleInteraction(i)}
              content={<Menu>{createMenu(topLevelItem.submenu)}</Menu>}
              transitionDuration={0}
              style={{
                transition: "none"
              }}
              inline
            >
              {button}
            </Popover>
          );
        })}
        {extraContent}
      </div>
    );
  }
}
