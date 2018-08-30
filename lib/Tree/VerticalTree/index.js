"use strict";

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _reactResizeDetector = require("react-resize-detector");

var _reactResizeDetector2 = _interopRequireDefault(_reactResizeDetector);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TreeMinimap = require("../TreeMinimap");

var _TreeMinimap2 = _interopRequireDefault(_TreeMinimap);

var _blackOrWhiteContrastsMore = require("../blackOrWhiteContrastsMore");

var _blackOrWhiteContrastsMore2 = _interopRequireDefault(_blackOrWhiteContrastsMore);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultColorCodes = ["#000000", "#8b4513", "#ff0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#EE82EE", "#808080", "#ffffff"];

/**
 * A relatively general purpose component that renders a tree in a vertical layout.
 * Key features include collapsible nodes and an optional minimap.
 *
 * @example ./VerticalTree.md
 */
var VerticalTree = (_temp2 = _class = function (_React$Component) {
  _inherits(VerticalTree, _React$Component);

  function VerticalTree() {
    var _temp, _this, _ret;

    _classCallCheck(this, VerticalTree);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      collapsedNodes: {}
    }, _this.handleExpanderClick = function (node) {
      return function () {
        var cardIdKey = _this.props.cardIdKey;

        var nodeId = (0, _lodash.get)(node, cardIdKey);
        _this.setState(function (_ref) {
          var _extends2;

          var collapsedNodes = _ref.collapsedNodes;
          return {
            collapsedNodes: _extends({}, collapsedNodes, (_extends2 = {}, _extends2[nodeId] = !collapsedNodes[nodeId], _extends2))
          };
        });
      };
    }, _this.setRootRef = function (node) {
      return _this.setState({ rootRef: node });
    }, _this.getScale = function () {
      return 1 / _this.props.zoom;
    }, _this.handleResize = function () {
      return _this.forceUpdate();
    }, _this.renderLevel = function (node) {
      var isMinimap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var connectorColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (_this.props.colorCodes || defaultColorCodes)[0];
      var _this$props = _this.props,
          renderNode = _this$props.renderNode,
          renderMinimapNode = _this$props.renderMinimapNode,
          renderConnectorLabel = _this$props.renderConnectorLabel,
          childrenKey = _this$props.childrenKey,
          cardIdKey = _this$props.cardIdKey,
          xOffsetPerUnitDepth = _this$props.xOffsetPerUnitDepth,
          colorCodes = _this$props.colorCodes,
          connectorThickness = _this$props.connectorThickness,
          horizontalLeaves = _this$props.horizontalLeaves,
          colorByDepth = _this$props.colorByDepth;
      var collapsedNodes = _this.state.collapsedNodes;

      var connectXSize = xOffsetPerUnitDepth - connectorThickness;

      var actuallyRenderNode = isMinimap && renderMinimapNode || renderNode;

      var isRoot = depth === 0 && !isMinimap;

      var nodeId = (0, _lodash.get)(node, cardIdKey);
      var children = (0, _lodash.get)(node, childrenKey, []);
      return _react2.default.createElement(
        "div",
        _extends({
          key: nodeId,
          style: {
            position: "relative",
            pointerEvents: isMinimap ? "none" : undefined,
            width: isRoot ? "min-content" : null,
            transformOrigin: "0 0",
            transform: isRoot && "scale(" + _this.getScale() + ")"
          }
        }, isRoot ? { ref: _this.setRootRef } : {}),
        isRoot && _react2.default.createElement(_reactResizeDetector2.default, {
          handleWidth: true,
          handleHeight: true,
          onResize: _this.handleResize
        }),
        _react2.default.createElement(
          "div",
          { style: { marginLeft: connectorThickness } },
          _react2.default.createElement(
            "div",
            { style: { position: "relative" } },
            _react2.default.createElement("div", {
              style: {
                position: "absolute",
                left: -connectorThickness,
                borderLeft: connectorThickness + "px solid " + connectorColor,
                // If the component has any children, we will need to make this line extend
                // down a little extra to overcome any gap between this card and its children.
                height: children.length && !collapsedNodes[nodeId] ? "125%" : "100%"
              }
            }),
            !!children.length && !isMinimap && _react2.default.createElement(
              "div",
              {
                style: {
                  position: "absolute",
                  left: -connectorThickness,
                  width: connectorThickness,
                  height: "50%",
                  display: "flex",
                  flexDirection: "column-reverse",
                  cursor: "pointer"
                }
              },
              _react2.default.createElement(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: -connectorThickness,
                    width: connectorThickness,
                    height: connectorThickness,
                    backgroundColor: connectorColor,
                    color: (0, _blackOrWhiteContrastsMore2.default)(connectorColor),
                    textAlign: "center",
                    lineHeight: connectorThickness + "px",
                    fontSize: connectorThickness + "px"
                  },
                  onClick: _this.handleExpanderClick(node)
                },
                collapsedNodes[nodeId] ? "►" : "▼"
              )
            ),
            actuallyRenderNode({ node: node, depth: depth })
          ),
          !!children.length && _react2.default.createElement(
            "div",
            {
              style: {
                marginLeft: xOffsetPerUnitDepth,
                position: "relative",
                display: collapsedNodes[nodeId] ? "none" : undefined
              }
            },
            _react2.default.createElement("div", {
              style: {
                position: "absolute",
                left: -xOffsetPerUnitDepth - connectorThickness,
                height: "50%",
                borderLeft: connectorThickness + "px solid " + connectorColor,
                width: connectXSize,
                borderBottom: connectorThickness + "px solid " + connectorColor
              }
            }),
            _react2.default.createElement("div", {
              style: {
                position: "absolute",
                left: -xOffsetPerUnitDepth - connectorThickness + connectXSize,
                height: "100%",
                borderLeft: connectorThickness + "px solid " + connectorColor
              }
            }),
            renderConnectorLabel && _react2.default.createElement(
              "div",
              {
                style: {
                  position: "relative",
                  left: -xOffsetPerUnitDepth + connectXSize
                }
              },
              renderConnectorLabel({ node: node, connectorColor: connectorColor })
            ),
            horizontalLeaves && _this.areChildNodesAllLeaves(node) ? _this.renderHorizontalLeaves(children, isMinimap, depth, colorCodes) : children.map(function (child, i) {
              return _this.renderLevel(child, isMinimap, depth + 1, colorByDepth ? colorCodes[(depth + 1) % colorCodes.length] : colorCodes[i % colorCodes.length]);
            })
          )
        )
      );
    }, _this.renderHorizontalLeaves = function (nodes, isMinimap, depth, colorCodes) {
      var _this$props2 = _this.props,
          renderNode = _this$props2.renderNode,
          renderMinimapNode = _this$props2.renderMinimapNode,
          cardIdKey = _this$props2.cardIdKey,
          connectorThickness = _this$props2.connectorThickness,
          colorByDepth = _this$props2.colorByDepth;

      var actuallyRenderNode = isMinimap && renderMinimapNode || renderNode;

      return _react2.default.createElement(
        "div",
        {
          style: {
            position: "relative",
            pointerEvents: isMinimap ? "none" : undefined,
            display: "flex",
            transformOrigin: "0 0"
          }
        },
        nodes.map(function (node, i) {
          var nodeId = (0, _lodash.get)(node, cardIdKey);
          var connectorColor = colorByDepth ? colorCodes[(depth + 1) % colorCodes.length] : colorCodes[i % colorCodes.length];

          return _react2.default.createElement(
            "div",
            { key: nodeId, style: { marginLeft: connectorThickness } },
            _react2.default.createElement(
              "div",
              { style: { position: "relative" } },
              _react2.default.createElement("div", {
                style: {
                  position: "absolute",
                  left: -connectorThickness,
                  borderLeft: connectorThickness + "px solid " + connectorColor,
                  height: "100%"
                }
              }),
              actuallyRenderNode({ node: node, depth: depth })
            )
          );
        })
      );
    }, _this.areChildNodesAllLeaves = function (node) {
      var childrenKey = _this.props.childrenKey;

      var children = (0, _lodash.get)(node, childrenKey, []);
      return children.every(function (child) {
        return (0, _lodash.get)(child, childrenKey, []).length === 0;
      });
    }, _this.renderMinimap = function () {
      var rootRef = _this.state.rootRef;
      var rootNode = _this.props.rootNode;

      return _react2.default.createElement(
        _TreeMinimap2.default,
        _extends({}, (0, _lodash.pick)(_this.props, ["minimapViewportSelector", "minimapThickness", "minimapParentSelector", "zoom"]), {
          rootRef: rootRef,
          isHorizontal: false
        }),
        _this.renderLevel(rootNode, true)
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  VerticalTree.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    var zoom = this.props.zoom;
    var nextZoom = nextProps.zoom;

    if (zoom !== nextZoom) {
      this.needsDoubleRender = true;
    }
  };

  VerticalTree.prototype.componentDidUpdate = function componentDidUpdate() {
    // This is a pretty hacky way of making sure everything
    // works properly in the zoom.
    if (this.needsDoubleRender) {
      this.needsDoubleRender = false;
      this.forceUpdate();
    }
  };

  VerticalTree.prototype.render = function render() {
    var _props = this.props,
        rootNode = _props.rootNode,
        includeMinimap = _props.includeMinimap,
        marginBottom = _props.marginBottom,
        marginRight = _props.marginRight;
    var rootRef = this.state.rootRef;

    var rootBcr = rootRef && rootRef.getBoundingClientRect();
    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        "div",
        {
          style: {
            overflow: "hidden",
            height: rootRef && rootBcr.height + marginBottom,
            width: rootRef && rootBcr.width + marginRight
          }
        },
        this.renderLevel(rootNode)
      ),
      !!includeMinimap && this.renderMinimap()
    );
  };

  return VerticalTree;
}(_react2.default.Component), _class.defaultProps = {
  cardIdKey: "id",
  childrenKey: "children",
  colorCodes: defaultColorCodes,
  connectorThickness: 10,
  horizontalLeaves: false,
  colorByDepth: true,
  includeMinimap: false,
  zoom: 1,
  marginRight: 0,
  marginBottom: 0
}, _temp2);
exports.default = VerticalTree;
VerticalTree.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * For each node, `node[idKey]` provides a unique id for each card.
   */
  cardIdKey: _propTypes2.default.string.isRequired,

  /**
   * For each node, `node[childrenKey]` provides an array of child nodes.
   */
  childrenKey: _propTypes2.default.string.isRequired,

  /**
   * An array of color codes to use to color in the connector lines.
   * The colors must be in hexadecimal form (e.g. `#FD04A5`.)
   */
  colorCodes: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,

  /**
   * The thickness of the connector lines in pixels.
   */
  connectorThickness: _propTypes2.default.number.isRequired,

  /**
   * Whether or not to include the minimap.
   */
  includeMinimap: _propTypes2.default.bool,

  /**
   * If set to `true`, connector line colors will be colored
   * by depth in the tree. Otherwise they will be colored according
   * to their index amongst their siblings.
   */
  colorByDepth: _propTypes2.default.bool,

  /**
   * The zoom value. Larger zoom values correspond to a more zoomed out
   * state.
   */
  zoom: _propTypes2.default.number.isRequired,

  /**
   * The right margin of the tree in pixels.
   */
  marginRight: _propTypes2.default.number,

  /**
   * The bottom margin of the tree in pixels.
   */
  marginBottom: _propTypes2.default.number,

  /**
   * The root node of the tree to render.
   */
  rootNode: _propTypes2.default.object.isRequired,

  /**
   * The function that actually renders whatever corresponds to a node.
   *
   * @param {Object} arg
   * @param {Object} arg.node The node to render.
   * @param {number} arg.depth Depth of the node.
   */
  renderNode: _propTypes2.default.func.isRequired,

  /**
   * Render the node in the minimap, if `includeMinimap` is `true`. Defaults to `renderNode`
   * if not supplied
   *
   * @param {Object} arg
   * @param {Object} arg.node The node to render.
   * @param {number} arg.depth Depth of the node.
   */
  renderMinimapNode: _propTypes2.default.func,

  /**
   * An optional function to render a label on the connector label lines.
   *
   * @param {Object} arg
   * @param {Object} arg.node The parent node of the connector.
   * @param {number} arg.connectorColor The color of the connector.
   */
  renderConnectorLabel: _propTypes2.default.func,

  /**
   * The DOM element that matches this CSS selector will used to position
   * and size the viewport on the minimap. This should be the element that
   * you scroll to navigate the tree.
   */
  minimapViewportSelector: _propTypes2.default.string,

  /**
   * The minimap will appended to the DOM element that matches this CSS selector.
   */
  minimapParentSelector: _propTypes2.default.string,

  /**
   * The height of the minimap in pixels.
   */
  minimapThickness: _propTypes2.default.number,

  /**
   * How much to indent each level of the tree, in pixels.
   */
  xOffsetPerUnitDepth: _propTypes2.default.number.isRequired,

  /**
   * Whether to render leaf cards in a horizontal line or vertically, like the other nodes.
   */
  horizontalLeaves: _propTypes2.default.bool
} : {};
module.exports = exports["default"];