import React from "react";

export default function BlueprintError({ error }) {
  if (!error) return null;
  return (
    <div className="pt-form-group pt-intent-danger">
      <div className="pt-form-helper-text preserve-newline">{error}</div>
    </div>
  );
}
