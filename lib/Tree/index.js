"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _HorizontalTree = require("./HorizontalTree");

var _HorizontalTree2 = _interopRequireDefault(_HorizontalTree);

var _VerticalTree = require("./VerticalTree");

var _VerticalTree2 = _interopRequireDefault(_VerticalTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree() {
    _classCallCheck(this, Tree);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Tree.prototype.render = function render() {
    var layout = this.props.layout;

    return layout === "horizontal" ? _react2.default.createElement(_HorizontalTree2.default, this.props) : _react2.default.createElement(_VerticalTree2.default, this.props);
  };

  return Tree;
}(_react2.default.Component);

exports.default = Tree;
module.exports = exports["default"];