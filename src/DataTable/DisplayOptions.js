//@flow
import React from "react";

import { Button, Popover, Position, Checkbox } from "@blueprintjs/core";
function noop() {}
export default class PagingTool extends React.Component {
  render() {
    const {
      schema,
      updateColumnVisibility = noop,
      resetDefaultVisibility = noop,
      disabled
    } = this.props;
    const { fields } = schema;

    let numVisible = 0;
    return (
      <Popover
        content={
          <div style={{ padding: 10, paddingLeft: 20, paddingRight: 20 }}>
            <h5>Displayed Columns:</h5>
            {fields.map(field => {
              const { displayName, isHidden, path } = field;
              if (!isHidden) numVisible++;
              return (
                <Checkbox
                  key={displayName}
                  onClick={() => {
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
        position={Position.TOP_RIGHT}
      >
        <Button disabled={disabled} className={"pt-minimal"} iconName={"cog"} />
      </Popover>
    );
  }
}
