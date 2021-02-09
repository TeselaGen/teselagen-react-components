import React from "react";
import { pickBy, isNumber, startsWith, flatMap, take, flatten } from "lodash";
import { Suggest } from "@blueprintjs/select";

import "./style.css";
import {
  Popover,
  Position,
  Menu,
  Button,
  Hotkeys,
  HotkeysTarget,
  Hotkey
} from "@blueprintjs/core";
import {
  createDynamicMenu,
  DynamicMenuItem,
  getStringFromReactComponent,
  doesSearchValMatchText
} from "../utils/menuUtils";
import { comboToLabel } from "../utils/hotkeyUtils";

class MenuBar extends React.Component {
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
  addHelpItemIfNecessary = (menu, i) => {
    return menu.map((item, innerIndex) => {
      const { isMenuSearch, inputProps, ...rest } = item;
      if (isMenuSearch) {
        const isTopLevelSearch = !isNumber(i);
        this.isTopLevelSearch = isTopLevelSearch;
        this.menuSearchIndex = isTopLevelSearch ? innerIndex : i;

        return {
          shouldDismissPopover: false,
          text: (
            <Suggest
              closeOnSelect={false}
              items={this.allMenuItems}
              itemListPredicate={filterMenuItems}
              itemDisabled={i => i.disabled}
              popoverProps={{
                minimal: true,
                popoverClassName: "tg-menu-search-suggestions"
              }}
              resetOnSelect={false}
              resetOnClose={false}
              inputProps={{
                inputRef: n => {
                  if (n) {
                    this.searchInput = n;
                    n.setAttribute &&
                      n.setAttribute(
                        "size",
                        n.getAttribute("placeholder").length
                      );
                  }
                },
                autoFocus: !isTopLevelSearch,
                placeholder: `Search the menus (${comboToLabel(
                  this.props.menuSearchHotkey || menuSearchHotkey,
                  false
                ).replace(/\s/g, "")})`,
                ...inputProps
              }}
              initialContent={null}
              onItemSelect={this.handleItemClickOrSelect()}
              inputValueRenderer={i => i.text}
              noResults={<div>No Results...</div>}
              itemRenderer={this.itemRenderer}
              {...rest}
            />
          )
        };
      } else {
        return item;
      }
    });
  };

  itemRenderer = (i, b) => {
    // if (i.submenu.length === 3) debugger;
    return (
      <DynamicMenuItem
        key={b.index}
        {...{
          doNotEnhanceTopLevelItem: true,
          enhancers: this.props.enhancers,
          def: {
            submenu: i.submenu,
            icon: i.icon,
            disabled: i.disabled,
            text: i.isSimpleText ? i.justText || i.text : i.text,
            label: i.path.length && (
              <span style={{ fontSize: 8 }}>
                {flatMap(i.path, (el, i2) => {
                  if (i2 === 0) return el;
                  return [" > ", el];
                })}
              </span>
            ),
            onClick: this.handleItemClickOrSelect(i),
            active: b.modifiers.active
            // shouldDismissPopover: true,
          }
        }}
      />
    );
  };
  // itemRenderer = (i, b) => {
  //   return (
  //     <MenuItem
  //       key={b.index}
  //       {...{
  //         // ...i,
  //         icon: i.icon,
  //         text: i.isSimpleText ? i.justText || i.text : i.text,
  //         label: i.path.length && (
  //           <span style={{ fontSize: 8 }}>
  //             {flatMap(i.path, (el, i2) => {
  //               if (i2 === 0) return el;
  //               return [" > ", el];
  //             })}
  //           </span>
  //         ),
  //         onClick: this.handleItemClickOrSelect(i),
  //         active: b.modifiers.active
  //         // shouldDismissPopover: true,
  //       }}
  //     />
  //   );
  // };

  handleItemClickOrSelect = __i => _i => {
    const i = __i || _i;
    if (!i.onClick) return;
    !i.disabled && i.onClick();
    if (i.shouldDismissPopover !== false) {
      this.setState({ isOpen: false });
    } else {
      if (_i && _i.stopPropagation) {
        _i.stopPropagation();
        _i.preventDefault();
      }
    }
  };
  renderHotkeys() {
    return (
      <Hotkeys>
        {isNumber(this.menuSearchIndex) && (
          <Hotkey
            allowInInput
            global={true}
            combo={
              (this.props && this.props.menuSearchHotkey) || menuSearchHotkey
            }
            label="Search the menu"
            preventDefault
            stopPropagation
            onKeyDown={this.toggleFocusSearchMenu}
          />
        )}
      </Hotkeys>
    );
  }
  toggleFocusSearchMenu = () => {
    //toggle off
    if (this.searchInput && document.activeElement === this.searchInput) {
      this.searchInput.blur();
      this.setState({
        isOpen: false,
        openIndex: this.menuSearchIndex
      });
    } else {
      //toggle on
      if (this.isTopLevelSearch) {
        this.searchInput && this.searchInput.focus();
      } else {
        this.setState({
          isOpen: true,
          openIndex: this.menuSearchIndex
        });
      }
    }
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
              canEscapeKeyClose
              onClosed={() => {
                this.props.onMenuClose && this.props.onMenuClose();
              }}
              portalClassName="tg-menu-bar-popover"
              position={Position.BOTTOM_LEFT}
              isOpen={isOpen && i === openIndex}
              onInteraction={this.handleInteraction(i)}
              content={
                <Menu>
                  {createDynamicMenu(
                    this.addHelpItemIfNecessary(topLevelItem.submenu, i),
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

const isDivider = item => item.divider !== undefined;

function getAllMenuTextsAndHandlers(menu, enhancers, context, path = []) {
  if (!menu) return [];
  return flatMap(menu, item => {
    const enhancedItem = [...enhancers].reduce((v, f) => f(v, context), item);
    if (isDivider(enhancedItem)) {
      return [];
    }
    if (enhancedItem && enhancedItem.hidden) return [];
    return [
      {
        ...enhancedItem,
        path
      },
      ...getAllMenuTextsAndHandlers(enhancedItem.submenu, enhancers, context, [
        ...path,
        enhancedItem.text
      ])
    ];
  });
}

const filterMenuItems = (searchVal, items) => {
  const newItems = flatMap(items, item => {
    const {
      text,
      onClick,
      hidden,
      hideFromMenuSearch,
      showInSearchMenu
    } = item;
    if (
      !showInSearchMenu &&
      (!text || !onClick || !searchVal || hideFromMenuSearch || hidden)
    )
      return [];
    //fix this to use some smart regex
    let justText = text;
    let isSimpleText = true;
    if (!text.toLowerCase) {
      if (text.props) {
        isSimpleText = false;
        justText = getStringFromReactComponent(text);
      } else {
        return [];
      }
    }

    if (doesSearchValMatchText(searchVal, justText)) {
      return {
        ...item,
        justText,
        isSimpleText
      };
    } else {
      return [];
    }
  }).sort((a, b) => a.justText.length - b.justText.length);

  return take(newItems, 10).map(i => ({
    ...i,
    justText: highlight(searchVal, i.justText)
  }));
};

const menuSearchHotkey = "meta+/";

function highlight(query, text, opts) {
  opts = opts || { tag: <strong /> };

  if (query.length === 0) {
    return text;
  }

  const offset = text.toLowerCase().indexOf(query[0].toLowerCase());
  if (offset === -1) return null;

  let last = 0;
  for (let i = 1; i < query.length; i++) {
    if (text[offset + i] !== query[i]) {
      break;
    }

    last = i;
  }

  const before = text.slice(0, offset);
  const match = <strong>{text.slice(offset, offset + last + 1)}</strong>;

  const after = highlight(
    query.slice(last + 1),
    text.slice(offset + last + 1),
    opts
  );

  return flatten([before, match, after]);
}

export default HotkeysTarget(MenuBar);
