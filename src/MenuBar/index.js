import React from "react";
import { pickBy, startsWith, flatMap, isArray, isString } from "lodash";
import { Suggest } from "@blueprintjs/select";
import "./style.css";
import { Popover, Position, Menu, MenuItem, Button } from "@blueprintjs/core";
import { createDynamicMenu } from "../utils/menuUtils";

export default class MenuBar extends React.Component {
  static defaultProps = {
    className: "",
    style: {}
  };

  state = { searchVal: "", isOpen: false, openIndex: null };

  handleInteraction = index => newOpenState => {
    if (!newOpenState && index !== this.state.openIndex) {
      return; //return early because the "close" is being fired by another popover
    }
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

  get allMenuItems() {
    const { menu, enhancers, context } = this.props;
    return getAllMenuTextsAndHandlers(menu, enhancers, context);
  }
  addHelpItemIfNecessary = menu => {
    return menu.map(item => {
      if (item.isMenuSearch) {
        return {
          shouldDismissPopover: false,
          text: (
            <div>
              <Suggest
                autoFocus
                closeOnSelect
                items={this.allMenuItems}
                itemPredicate={filterMenuItem}
                itemDisabled={i => i.disabled}
                popoverProps={{ minimal: true }}
                resetOnSelect
                resetOnClose
                inputProps={{
                  autoFocus: true,
                  placeholder: "Search The Menus..."
                }}
                initialContent={null}
                onItemSelect={item => {
                  this.setState({ isOpen: false });
                  !item.disabled && item.onClick();
                }}
                inputValueRenderer={i => i.text}
                noResults={<div>No Results...</div>}
                itemRenderer={itemRenderer}
              />
            </div>
          )
        };
      } else {
        return item;
      }
    });
  };

  render() {
    const { className, style, menu, enhancers, extraContent } = this.props;
    const { isOpen, openIndex } = this.state;

    return (
      <div className={"tg-menu-bar " + className} style={style}>
        {this.addHelpItemIfNecessary(menu).map((topLevelItem, i) => {
          const dataKeys = pickBy(topLevelItem, function(value, key) {
            return startsWith(key, "data-");
          });

          // Support enhancers for top level items too
          topLevelItem = enhancers.reduce((v, f) => f(v), topLevelItem);

          if (topLevelItem.hidden) {
            return null;
          }

          const button = (
            <Button
              {...dataKeys} //spread all data-* attributes
              key={i}
              minimal
              className="tg-menu-bar-item"
              onClick={topLevelItem.onClick}
              disabled={topLevelItem.disabled}
              onMouseOver={
                topLevelItem.submenu ? this.handleMouseOver(i) : noop
              }
            >
              {topLevelItem.text}
            </Button>
          );
          return !topLevelItem.submenu ? (
            button
          ) : (
            <Popover
              autoFocus={false}
              key={i}
              minimal
              portalClassName="tg-menu-bar-popover"
              position={Position.BOTTOM_LEFT}
              isOpen={isOpen && i === openIndex}
              onInteraction={this.handleInteraction(i)}
              content={
                <Menu>
                  {createDynamicMenu(
                    this.addHelpItemIfNecessary(topLevelItem.submenu),
                    enhancers
                  )}
                </Menu>
              }
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

function noop() {}

function getAllMenuTextsAndHandlers(menu, enhancers, context, path = []) {
  if (!menu) return [];
  return flatMap(menu, item => {
    const _item = [...enhancers].reduce((v, f) => f(v, context), item);
    if (isDivider(_item)) {
      return [];
    }
    return [
      {
        ..._item,
        path
      },
      ...getAllMenuTextsAndHandlers(_item.submenu, enhancers, context, [
        ...path,
        item.text
      ])
    ];
  });
}

const isDivider = item => item.divider !== undefined;

const filterMenuItem = (searchVal, { text, onClick, hideFromMenuSearch }) => {
  if (!text || !onClick || !searchVal || hideFromMenuSearch) return false;
  //fix this to use some smart regex
  let _text = text;
  if (!text.toLowerCase) {
    if (text.props) {
      _text = getStringFromReactComponent(text);
    } else {
      return false;
    }
  }
  return _text.toLowerCase().indexOf(searchVal.toLowerCase()) > -1;
};

function getStringFromReactComponent(comp) {
  if (!comp) return "";
  if (isString(comp)) return comp;
  const { children } = comp.props;
  if (!children) return "";
  if (isArray(children))
    return flatMap(children, getStringFromReactComponent).join("");
  if (isString(children)) return children;

  if (children.props) {
    return getStringFromReactComponent(children.props);
  }
}

const itemRenderer = (i, b) => {
  return (
    <MenuItem
      {...i}
      icon={undefined}
      text={i.text}
      label={
        i.path.length && (
          <span style={{ fontSize: 8 }}>
            {flatMap(i.path, (el, i2) => {
              if (i2 === 0) return el;
              return [" > ", el];
            })}
          </span>
        )
      }
      onClick={b.handleClick}
      active={b.modifiers.active}
      shouldDismissPopover
      key={b.index}
    />
  );
};
