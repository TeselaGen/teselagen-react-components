import React from "react";
import { Icon } from "@blueprintjs/core";

export default {
  width: 35,
  noEllipsis: true,
  immovable: true,
  type: "action",
  render: () => {
    return <Icon className="dt-eyeIcon" icon="eye-open" />;
  }
};
