import React from "react";
import { FillWindow } from "../../../src";

export default () => (
  <FillWindow>
    {size => {
      console.info("size:", size);
      return (
        <div>
          window size: height: {size.height}
          width: {size.width}
          hey!
        </div>
      );
    }}
  </FillWindow>
);
