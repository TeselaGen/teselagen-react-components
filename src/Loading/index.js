import React from "react";
import { Intent, Spinner } from "@blueprintjs/core";

export default function Loading({ loading, children, ...rest }) {
  if (loading) {
    return (
      <div className={"loading-body"}>
        <Spinner intent={Intent.PRIMARY} className={"spinner"} {...rest} />
      </div>
    );
  } else {
    return children || null;
  }
}
