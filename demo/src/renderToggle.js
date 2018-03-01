import React from "react";
import { Switch } from "@blueprintjs/core";

export default function renderToggle(that, type, description) {
  return (
    <div className={"toggle-button-holder"}>
      <Switch
        checked={that.state[type]}
        label={type}
        onChange={() => {
          that.setState({
            [type]: !that.state[type]
          });
        }}
      />
      {description && <span>{description}</span>}
    </div>
  );
}
