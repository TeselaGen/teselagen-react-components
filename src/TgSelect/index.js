import { MultiSelect /* Suggest */ } from "@blueprintjs/select";
import { /* MenuItem, */ Button, MenuItem } from "@blueprintjs/core";
import React from "react";
import { filter, isEqual } from "lodash";
import fuzzysearch from "fuzzysearch";
import classnames from "classnames";
import "./style.css";

class TgSelect extends React.Component {
  state = {
    isOpen: false,
    query: ""
  };
  itemRenderer = (i, { index, handleClick, modifiers }) => {
    const { optionRenderer } = this.props;
    return (
      <div
        onClick={handleClick}
        key={index}
        className={classnames("tg-select-option bp3-menu-item", {
          "bp3-active": modifiers.active,
          "bp3-disabled": modifiers.disabled
        })}
      >
        {optionRenderer ? optionRenderer(i) : i.label}
      </div>
    );
  };
  tagRenderer = i => {
    if (!this.props.multi && this.state.query) {
      return null;
    }
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
      this.tagInput && this.tagInput.blur();
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
    this.setState({ query: "" });
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
  onQueryChange = query => {
    this.setState({
      query
    });
  };
  onInteraction = (nextOpenState, e) => {
    e && e.persist();
    if (this.justRemovedId && nextOpenState) {
      //hack to stop the popover from popping up again
      clearTimeout(this.justRemovedId);
      this.justRemovedId = null;
      return;
    }
    this.setState({
      isOpen: nextOpenState,
      ...(!nextOpenState && { query: "" })
    });
  };

  render() {
    const {
      multi,
      options,
      value,
      createable,
      optionRenderer, //pull this one out here so it doesn't get passsed along
      tagInputProps,
      noResultsText,
      noResults = noResultsDefault,
      inputProps,
      placeholder = "Select...",
      isLoading,
      ...rest
    } = this.props;
    // const Comp = multi ? MultiSelect : Suggest;
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
            className="tg-select-clear-all"
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

    return (
      <MultiSelect
        closeOnSelect={!multi}
        items={options || []}
        itemDisabled={itemDisabled}
        resetOnSelect
        query={this.state.query}
        popoverProps={{
          minimal: true,
          className: classnames("tg-select", {
            "tg-single-select": !multi
          }),
          wrapperTagName: "div",
          usePortal: false,
          onInteraction: this.onInteraction,
          isOpen: this.state.isOpen
        }}
        resetOnClose
        onItemSelect={this.handleItemSelect}
        createNewItemFromQuery={maybeCreateNewItemFromQuery}
        createNewItemRenderer={maybeCreateNewItemRenderer}
        noResults={noResultsText || noResults}
        onQueryChange={this.onQueryChange}
        itemRenderer={this.itemRenderer}
        itemPredicate={this.itemPredicate}
        {...{
          selectedItems: multi
            ? value
              ? Array.isArray(value)
                ? value
                : [value]
              : []
            : [options.find(opt => opt && opt.value === value) || value],
          tagRenderer: this.tagRenderer,
          tagInputProps: {
            inputRef: n => {
              if (n) this.tagInput = n;
            },
            placeholder,
            tagProps: {
              intent: "primary",
              minimal: true,
              className: "tg-select-value",
              ...(!multi && { onRemove: null })
            },
            onRemove: this.handleTagRemove,
            rightElement: rightElement,

            ...tagInputProps //spread additional tag input props here
          }
        }}
        isLoading={isLoading}
        {...rest}
      />
    );
  }
}
export default TgSelect;

// const inputValueRenderer = i => {
//   console.log(`i.label:`,i.label)
//   return i.label || i};
const itemDisabled = i => i.disabled;
const noResultsDefault = <div>No Results...</div>;

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
