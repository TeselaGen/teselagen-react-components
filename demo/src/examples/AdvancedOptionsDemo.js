import React from "react";
import AdvancedOptions from "../../../src/AdvancedOptions";

export default () => (
  <div>
    I'm some text lalala l<br></br>
    <br></br>
    <AdvancedOptions>I'm some more advanced options </AdvancedOptions>
    alsdfalsdf
    <br></br>
    <br></br>
    <br></br>
    isOpenByDefault:
    <AdvancedOptions isOpenByDefault>
      I'm some more advanced options{" "}
    </AdvancedOptions>
    <br></br>
    <br></br>
    custom label (label="lalal"):
    <AdvancedOptions label="lalal">
      I'm some more advanced options{" "}
    </AdvancedOptions>
  </div>
);
