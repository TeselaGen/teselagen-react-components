function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import HorizontalTree from "./HorizontalTree";
import VerticalTree from "./VerticalTree";

var Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree() {
    _classCallCheck(this, Tree);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Tree.prototype.render = function render() {
    var layout = this.props.layout;

    return layout === "horizontal" ? React.createElement(HorizontalTree, this.props) : React.createElement(VerticalTree, this.props);
  };

  return Tree;
}(React.Component);

export default Tree;