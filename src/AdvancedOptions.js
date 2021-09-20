import React, { useState } from "react";
import { Icon } from "@blueprintjs/core";

export default function AdvancedOptions({
  children,
  content,
  label,
  isOpenByDefault
}) {
  const [isOpen, setOpen] = useState(isOpenByDefault);
  if (!(content || children)) {
    return null;
  }
  return (
    <div style={{ marginTop: 5 }}>
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        {label || "Advanced"}{" "}
        <Icon icon={isOpen ? "caret-up" : "caret-down"}></Icon>
      </div>
      {isOpen && <div style={{ marginTop: 10 }}>{content || children}</div>}
    </div>
  );
}
