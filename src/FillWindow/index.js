import React from "react";
import { debounce } from "lodash";

export default class FillWindow extends React.Component {
  updateDimensions = debounce(() => {
    this.setState({ randomRerenderTrigger: Math.random() });
  }, 100);
  
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render () {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    const windowDimensions = {
      width: x,
      height: y
    };
    return (
      this.props.children(windowDimensions)
    )
  }
}