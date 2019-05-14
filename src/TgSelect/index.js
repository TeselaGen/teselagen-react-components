import { MultiSelect, Suggest } from "@blueprintjs/select";
import { /* MenuItem, */ Button, MenuItem } from "@blueprintjs/core";
import React from "react";
import { filter, isEqual } from "lodash";
import fuzzysearch from "fuzzysearch";
import classnames from "classnames";
import "./style.css";

class TgSelect extends React.Component {
  state = {
    isOpen: false
  };
  itemRenderer = (i, { index, handleClick, modifiers }) => {
    return (
      <div
        onClick={handleClick}
        key={index}
        className={classnames("tg-select-option bp3-menu-item", {
          "bp3-active": modifiers.active,
          "bp3-disabled": modifiers.disabled
        })}
      >
        {i.label}
      </div>
      // <MenuItem
      //   active={modifiers.active}
      //   disabled={modifiers.disabled}
      //   onClick={handleClick}
      //   key={index}
      //   text={i.label}
      // />
    );
  };
  tagRenderer = i => {
    return i.label;
  };

  handleItemSelect = item => {
    const { onChange, value, multi } = this.props;
    if (multi) {
      const valArray = value ? (Array.isArray(value) ? value : [value]) : [];
      const filteredVals = filter(
        value,
        obj => !isEqual(obj.value, item.value)
      );
      if (filteredVals.length !== valArray.length)
        return onChange(filteredVals);
      return onChange([...filteredVals, item]);
    } else {
      this.setState({ isOpen: false });
      return onChange(item);
    }
  };

  handleTagRemove = (string, index) => {
    const { onChange, value } = this.props;
    const filteredVals = filter(value, (obj, i) => !isEqual(i, index));

    //hack to stop the popover from popping up again:
    this.justRemovedId = setTimeout(() => {
      this.justRemovedId = null;
    }, 100);

    return onChange(filteredVals);
  };

  handleClear = e => {
    const { onChange } = this.props;
    onChange([]);
    this.setState({ isOpen: false });
    e.stopPropagation();
    e.preventDefault();
  };

  itemPredicate = (queryString, item) => {
    const { label } = item;
    const { value, multi } = this.props;
    if (multi) {
      const valArray = value ? (Array.isArray(value) ? value : [value]) : [];
      const filteredVals = filter(
        value,
        obj => !isEqual(obj.value, item.value)
      );
      if (filteredVals.length !== valArray.length) return false;
    }
    return fuzzysearch(
      queryString.toLowerCase(),
      label && label.toLowerCase
        ? label.toLowerCase()
        : (item.value && item.value.toLowerCase && item.value.toLowerCase()) ||
            ""
    );
  };
  onInteraction = (nextOpenState, e) => {
    e && e.persist();
    if (this.justRemovedId && nextOpenState) {
      clearTimeout(this.justRemovedId);
      this.justRemovedId = null;
      return;
    }
    this.setState({ isOpen: nextOpenState });
  };

  render() {
    const {
      multi,
      options,
      value,
      createable,
      tagInputProps,
      inputProps,
      placeholder = "Select...",
      isLoading,
      ...rest
    } = this.props;
    const Comp = multi ? MultiSelect : Suggest;
    const rightElement = isLoading ? (
      <Button loading minimal />
    ) : (
      <span>
        {(Array.isArray(value) ? (
          value.length > 0
        ) : (
          value
        )) ? (
          <Button
            lassName="tg-select-clear-all"
            icon="cross"
            minimal
            onClick={this.handleClear}
          />
        ) : (
          undefined
        )}
        <Button
          className="tg-select-toggle"
          minimal
          icon={this.state.isOpen ? "caret-up" : "caret-down"}
        />
      </span>
    );
    const maybeCreateNewItemFromQuery = createable
      ? createNewOption
      : undefined;
    const maybeCreateNewItemRenderer = createable
      ? renderCreateNewOption
      : null;

    const getTagProps = () => ({
      intent: "primary",
      minimal: true,
      className: "tg-select-value"
    });
    return (
      <Comp
        closeOnSelect={!multi}
        items={options || []}
        itemDisabled={itemDisabled}
        resetOnSelect
        popoverProps={{
          minimal: true,
          className: "tg-select",
          wrapperTagName: "div",
          usePortal: false,
          onInteraction: this.onInteraction,
          isOpen: this.state.isOpen
        }}
        resetOnClose
        onItemSelect={this.handleItemSelect}
        createNewItemFromQuery={maybeCreateNewItemFromQuery}
        createNewItemRenderer={maybeCreateNewItemRenderer}
        noResults={noResults}
        itemRenderer={this.itemRenderer}
        itemPredicate={this.itemPredicate}
        {...(multi
          ? {
              selectedItems: value
                ? Array.isArray(value)
                  ? value
                  : [value]
                : [],
              tagRenderer: this.tagRenderer,
              tagInputProps: {
                placeholder,
                tagProps: getTagProps,
                onRemove: this.handleTagRemove,
                rightElement: rightElement,
                ...tagInputProps //spread additional tag input props here
              }
            }
          : {
              inputValueRenderer,
              selectedItem:
                options.find(opt => opt && opt.value === value) || value,
              inputProps: {
                placeholder,
                rightElement: rightElement,
                ...inputProps //spread additional input props here
              }
            })}
        isLoading={isLoading}
        // onQueryChange={this.handleTgSelectSearch}
        {...rest}
        // name={passedName}
      />
    );
  }
}
export default TgSelect;

const inputValueRenderer = i => i.label || i;
const itemDisabled = i => i.disabled;
const noResults = <div>No Results...</div>;

export const renderCreateNewOption = (query, active, handleClick) => (
  <MenuItem
    icon="add"
    text={`Create "${query}"`}
    active={active}
    onClick={handleClick}
    shouldDismissPopover={false}
  />
);

export function createNewOption(newValString) {
  return {
    userCreated: true,
    label: newValString,
    value: newValString
  };
}
