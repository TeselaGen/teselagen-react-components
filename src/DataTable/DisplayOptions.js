//@flow
import React from "react";

import { Button, Checkbox } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/labs";

function noop() {}
export default class DisplayOptions extends React.Component {
  state = {
    isOpen: false
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
    const { isOpen } = this.state;
    const {
      schema,
      updateColumnVisibility = noop,
      resetDefaultVisibility = noop,
      userSpecifiedCompact,
      disabled
    } = this.props;
    const { fields } = schema;

    let numVisible = 0;
    return (
      <Popover2
        isOpen={isOpen}
        onClose={this.closePopover}
        content={
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
            {fields.map((field, i) => {
              const { displayName, isHidden, path } = field;
              if (!isHidden) numVisible++;
              return (
                <Checkbox
                  key={path || i}
                  /* eslint-disable react/jsx-no-bind*/
                  onChange={() => {
                    if (numVisible <= 1 && !isHidden) {
                      return window.toastr.warning(
                        "We have to display at least one column :)"
                      );
                    }
                    updateColumnVisibility({ shouldShow: isHidden, path });
                  }}
                  /* eslint-enable react/jsx-no-bind*/
                  checked={!isHidden}
                  label={displayName}
                />
              );
            })}
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
