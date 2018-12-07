/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React from "react";
import { Spinner, Classes } from "@blueprintjs/core";

export default function AsyncValidateFieldSpinner({ validating }) {
  if (validating) {
    return <Spinner className={Classes.SMALL} />;
  } else {
    return null;
  }
}
