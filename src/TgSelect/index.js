import { MultiSelect } from "@blueprintjs/select";
import { Keys, Button, MenuItem } from "@blueprintjs/core";
import React from "react";
import { filter, isEqual } from "lodash";
import fuzzysearch from "fuzzysearch";
import classNames from "classnames";
import "./style.css";

class TgSelect extends React.Component {
  state = {
    isOpen: false,
    activeItem: null,
    query: ""
  };
  static defaultProps = {
    onChange: () => {},
    options: [],
    value: undefined
  };
  itemRenderer = (i, { index, handleClick, modifiers }) => {
    const { optionRenderer } = this.props;
    return (
      <div //we specifically don't use a BP MenuItem component here because the menu item is too slow when 100s are loaded and will cause the component to lag
        onClick={i.onClick || handleClick}
        key={index}
        className={classNames(
          "tg-select-option bp3-menu-item bp3-fill bp3-text-overflow-ellipsis",
          {
            "bp3-active": modifiers.active,
            "bp3-disabled": modifiers.disabled
          }
        )}
      >
        {optionRenderer ? optionRenderer(i) : i.label}
      </div>
    );
  };
  tagRenderer = i => {
    if (!i || (!this.props.multi && this.state.query)) {
      return null;
    }
    return i.label;
  };

  handleItemSelect = item => {
    const { onChange, value, multi } = this.props;
    this.setState({ activeItem: null });
    if (multi) {
      const valArray = getValueArray(value);
      return onChange([...valArray, item]);
    } else {
      this.setState({ isOpen: false });
      this.input && this.input.blur();
      return onChange(item);
    }
  };

  handleTagRemove = (e, tagProps) => {
    const { onChange, value } = this.props;
    const filteredVals = filter(
      value,
      (obj, i) => !isEqual(i, tagProps["data-tag-index"])
    );
    e.stopPropagation();
    onChange(filteredVals);
    this.input.focus();
  };
  handleTagInputRemove = (val, index) => {
    const { onChange, value } = this.props;
    const filteredVals = filter(value, (obj, i) => !isEqual(i, index));
    // e.stopPropagation();
    return onChange(filteredVals);
  };

  handleClear = e => {
    e.stopPropagation();
    e.preventDefault();
    const { onChange } = this.props;
    this.setState({ query: "" });
    onChange([]);
    this.setState({ isOpen: false });
    this.input.focus();
  };

  itemPredicate = (queryString, item) => {
    const { label } = item;
    const { value, multi } = this.props;
    if (multi) {
      const valArray = getValueArray(value);

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
    const { onInputChange = () => {} } = this.props;
    this.setState({
      query
    });
    onInputChange(query);
  };
  handleActiveItemChange = item => {
    // const { onInputChange = () => {} } = this.props;
    this.setState({
      activeItem: item
    });
    // onInputChange(query);
  };
  onInteraction = () => {
    if (this.input != null && this.input !== document.activeElement) {
      // the input is no longer focused so we can close the popover
      this.setState({ isOpen: false, query: "" });
    } else if (!this.props.openOnKeyDown) {
      // open the popover when focusing the tag input
      this.setState({ isOpen: true });
    }
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
      onBlur,
      ...rest
    } = this.props;
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
          onClick={e => {
            if (this.state.isOpen) {
              e.stopPropagation();

              this.setState({ isOpen: false });
            }
          }}
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
    const selectedItems = getValueArray(value).map(value => {
      if (value && value.label) return value; //if the value has a label, just use that
      //if not, look for an existing option to use that value
      return options.find(
        opt => opt && opt.value === ((value && value.value) || value)
      );
    });
    return (
      <MultiSelect
        onActiveItemChange={this.handleActiveItemChange}
        closeOnSelect={!multi}
        items={options || []}
        activeItem={
          this.state.activeItem ||
          (options && options.filter(opt => !selectedItems.includes(opt))[0])
        }
        itemDisabled={itemDisabled}
        resetOnSelect
        query={this.state.query}
        popoverProps={{
          minimal: true,
          className: classNames("tg-select", {
            "tg-single-select": !multi
          }),
          wrapperTagName: "div",
          usePortal: false,
          canEscapeKeyClose: true,
          onInteraction: this.onInteraction,
          isOpen: this.state.isOpen
        }}
        onKeyDown={e => {
          const { which } = e;
          if (which === Keys.ENTER) {
            e.preventDefault();

            e.stopPropagation(); //this prevents dialog's it is in from closing
          }
          if (which === Keys.ESCAPE || which === Keys.TAB) {
            // By default the escape key will not trigger a blur on the
            // input element. It must be done explicitly.
            if (this.input != null) {
              this.input.blur();
            }
            this.setState({ isOpen: false });
            e.preventDefault();
            e.stopPropagation(); //this prevents dialog's it is in from closing
          } else if (
            !(
              which === Keys.BACKSPACE ||
              which === Keys.ARROW_LEFT ||
              which === Keys.ARROW_RIGHT
            )
          ) {
            this.setState({ isOpen: true });
          }
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
          selectedItems,
          tagRenderer: this.tagRenderer,
          tagInputProps: {
            inputRef: n => {
              if (n) this.input = n;
            },
            placeholder,
            tagProps: {
              intent: "primary",
              minimal: true,
              className: "tg-select-value",
              onRemove: multi ? this.handleTagRemove : null
            },
            onRemove: multi ? this.handleTagInputRemove : null,
            rightElement: rightElement,
            ...tagInputProps, //spread additional tag input props here
            inputProps: {
              onBlur,
              ...(tagInputProps && tagInputProps.inputProps)
            }
          }
        }}
        isLoading={isLoading}
        {...rest}
      />
    );
  }
}
export default TgSelect;

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

function getValueArray(value) {
  return value || value === 0 ? (Array.isArray(value) ? value : [value]) : [];
}
