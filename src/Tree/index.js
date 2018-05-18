import React from "react";
import HorizontalTree from "./HorizontalTree";
import VerticalTree from "./VerticalTree";

class Tree extends React.Component {
  render() {
    const { layout } = this.props;
    return layout === "horizontal" ? (
      <HorizontalTree {...this.props} />
    ) : (
      <VerticalTree {...this.props} />
    );
  }
}

export default Tree;
