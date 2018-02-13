import React from "react";
import { Switch } from "@blueprintjs/core";

export default function renderToggle(that, type, description) {
  return (
    <div className={"toggle-button-holder"}>
      <Switch
        checked={that.state[type]}
        label={type}
        /* eslint-disable react/jsx-no-bind */

        onChange={() => {
          that.setState({
            [type]: !that.state[type]
          });
        }}
        /* eslint-enable react/jsx-no-bind */
      />
      {description && <span>{description}</span>}
    </div>
  );
}
