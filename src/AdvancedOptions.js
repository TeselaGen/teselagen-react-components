import React, { useState } from "react";
import { Icon } from "@blueprintjs/core";

export default function AdvancedOptions({
  children,
  content,
  label,
  style,
  isOpenByDefault
}) {
  const [isOpen, setOpen] = useState(isOpenByDefault);
  if (!(content || children)) {
    return null;
  }
  return (
    <div style={{ marginTop: 5, ...style }}>
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
        className="tg-toggle-advanced-options"
      >
        {label || "Advanced"}{" "}
        <Icon icon={isOpen ? "caret-down" : "caret-right"}></Icon>
      </div>
      {isOpen && <div style={{ marginTop: 10 }}>{content || children}</div>}
    </div>
  );
}
