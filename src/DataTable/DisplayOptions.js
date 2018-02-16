//@flow
import React from "react";
import { map, isEmpty, noop } from "lodash";
import {
  Button,
  Checkbox,
  Menu,
  MenuItem,
  Classes,
  InputGroup
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/labs";

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

  render() {
    const { isOpen, searchTerms } = this.state;
    const {
      schema,
      updateColumnVisibility = noop,
      resetDefaultVisibility = noop,
      userSpecifiedCompact,
      disabled
    } = this.props;
    const { fields } = schema;
    const fieldGroups = {};
    const mainFields = [];
    fields.forEach(field => {
      if (!field.fieldGroup) return mainFields.push(field);
      if (!fieldGroups[field.fieldGroup]) fieldGroups[field.fieldGroup] = [];
      fieldGroups[field.fieldGroup].push(field);
    });

    let numVisible = 0;

    const getFieldCheckbox = (field, i) => {
      const { displayName, isHidden, path } = field;
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
        const anyVisible = groupFields.some(field => !field.isHidden);
        return (
          <MenuItem key={groupName} text={groupName}>
            <InputGroup
              leftIconName="search"
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
      <Popover2
        isOpen={isOpen}
        onClose={this.closePopover}
        content={
          <Menu>
            <div style={{ padding: 10, paddingLeft: 20, paddingRight: 20 }}>
              <h5 style={{ marginBottom: 10 }}>Display Density:</h5>
              <div className="pt-select">
                <select
                  onChange={this.changeTableDensity}
                  value={userSpecifiedCompact ? "compact" : "normal"}
                >
                  <option className="pt-popover-dismiss" value="normal">
                    Normal
                  </option>
                  <option className="pt-popover-dismiss" value="compact">
                    Compact
                  </option>
                </select>
              </div>
              <h5 style={{ marginBottom: 10, marginTop: 10 }}>
                Displayed Columns:
              </h5>
              {mainFields.map(getFieldCheckbox)}
              {fieldGroupMenu}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  onClick={resetDefaultVisibility}
                  title={"Display Options"}
                  className={"pt-minimal"}
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
          className={"pt-minimal"}
          iconName={"cog"}
        />
      </Popover2>
    );
  }
}
