import React from "react";
import { Intent, Spinner } from "@blueprintjs/core";
import "./style.css";
export default function Loading({ loading, children, ...rest }) {
  if (loading) {
    return (
      <Spinner
        intent={Intent.PRIMARY}
        className={"tg-loading-spinner"}
        {...rest}
      />
    );
  } else {
    return children || null;
  }
}
