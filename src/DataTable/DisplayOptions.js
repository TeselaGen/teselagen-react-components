//@flow
import React from "react";
import { map, isEmpty, noop } from "lodash";
import {
  Button,
  Checkbox,
  Menu,
  MenuItem,
  Classes,
  InputGroup,
  Popover,
  Switch
} from "@blueprintjs/core";

export default class DisplayOptions extends React.Component {
  state = {
    isOpen: false,
    searchTerms: {}
  };

  openPopover = () => {
    this.setState({
      isOpen: true
    });
  };

  closePopover = () => {
    this.setState({
      isOpen: false
    });
  };

  changeTableDensity = e => {
    const { updateTableDisplayDensity = noop } = this.props;
    updateTableDisplayDensity(e.target.value);
    this.closePopover();
  };

  toggleForcedHidden = e => this.props.setShowForcedHidden(e.target.checked);

  render() {
    const { isOpen, searchTerms } = this.state;
    const {
      schema,
      updateColumnVisibility = noop,
      resetDefaultVisibility = noop,
      compact,
      disabled,
      hasOptionForForcedHidden,
      showForcedHiddenColumns,
      hideDisplayOptionsIcon
    } = this.props;
    if (hideDisplayOptionsIcon) {
      return null; //don't show antyhing!
    }
    const { fields } = schema;
    const fieldGroups = {};
    const mainFields = [];

    fields.forEach(field => {
      if (field.hideInMenu) return;
      if (!field.fieldGroup) return mainFields.push(field);
      if (!fieldGroups[field.fieldGroup]) fieldGroups[field.fieldGroup] = [];
      fieldGroups[field.fieldGroup].push(field);
    });

    let numVisible = 0;

    const getFieldCheckbox = (field, i) => {
      const { displayName, isHidden, isForcedHidden, path } = field;
      if (isForcedHidden) return;
      if (!isHidden) numVisible++;
      return (
        <Checkbox
          key={path || i}
          onChange={() => {
            if (numVisible <= 1 && !isHidden) {
              return window.toastr.warning(
                "We have to display at least one column :)"
              );
            }
            updateColumnVisibility({ shouldShow: isHidden, path });
          }}
          checked={!isHidden}
          label={displayName}
        />
      );
    };

    let fieldGroupMenu;
    if (!isEmpty(fieldGroups)) {
      fieldGroupMenu = map(fieldGroups, (groupFields, groupName) => {
        const searchTerm = searchTerms[groupName] || "";
        const anyVisible = groupFields.some(
          field => !field.isHidden && !field.isForcedHidden
        );
        const anyNotForcedHidden = groupFields.some(
          field => !field.isForcedHidden
        );
        if (!anyNotForcedHidden) return;
        return (
          <MenuItem key={groupName} text={groupName}>
            <InputGroup
              leftIcon="search"
              value={searchTerm}
              onChange={e => {
                this.setState({
                  searchTerms: {
                    ...searchTerms,
                    [groupName]: e.target.value
                  }
                });
              }}
            />
            <Button
              className={Classes.MINIMAL}
              text={(anyVisible ? "Hide" : "Show") + " All"}
              style={{ margin: "10px 0" }}
              onClick={() => {
                updateColumnVisibility({
                  shouldShow: !anyVisible,
                  paths: groupFields.map(field => field.path)
                });
              }}
            />
            {groupFields
              .filter(
                field =>
                  field.displayName
                    .toLowerCase()
                    .indexOf(searchTerm.toLowerCase()) > -1
              )
              .map(getFieldCheckbox)}
          </MenuItem>
        );
      });
    }

    return (
      <Popover
        isOpen={isOpen}
        onClose={this.closePopover}
        content={
          <Menu>
            <div style={{ padding: 10, paddingLeft: 20, paddingRight: 20 }}>
              <h5 style={{ marginBottom: 10 }}>Display Density:</h5>
              <div className={Classes.SELECT}>
                <select
                  onChange={this.changeTableDensity}
                  value={compact ? "compact" : "normal"}
                >
                  <option className={Classes.POPOVER_DISMISS} value="normal">
                    Normal
                  </option>
                  <option className={Classes.POPOVER_DISMISS} value="compact">
                    Compact
                  </option>
                </select>
              </div>
              <h5 style={{ marginBottom: 10, marginTop: 10 }}>
                Displayed Columns:
              </h5>
              {mainFields.map(getFieldCheckbox)}
              {fieldGroupMenu}
              {hasOptionForForcedHidden && (
                <div style={{ marginTop: 15 }}>
                  <Switch
                    label="Show Empty Columns"
                    checked={showForcedHiddenColumns}
                    onChange={this.toggleForcedHidden}
                  />
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  onClick={resetDefaultVisibility}
                  title="Display Options"
                  minimal
                >
                  Reset
                </Button>
              </div>
            </div>
          </Menu>
        }
      >
        <Button
          onClick={this.openPopover}
          disabled={disabled}
          minimal
          icon="cog"
        />
      </Popover>
    );
  }
}
