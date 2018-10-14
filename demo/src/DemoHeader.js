import React, { Component } from "react";
import {Icon} from "@blueprintjs/core";
import "./style.css";


class DemoHeader extends Component {
  render() {
    return (
      <div className="demo-header">
        <a style={{fontSize: 35, color: "white"}} href="https://github.com/TeselaGen/teselagen-react-components">TeselaGen React Components <Icon icon="link"/></a>
      </div>
    );
  }
}

export default DemoHeader;
