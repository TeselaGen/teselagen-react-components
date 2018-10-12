import React from "react";

import { Spinner } from "@blueprintjs/core";

import "./loader.css";

const Loader = () => (
  <div className={"mss-loader"}>
    <Spinner style={{ width: 100 }} />
  </div>
);

export default Loader;
