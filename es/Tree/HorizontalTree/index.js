var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import { get, pick } from "lodash";
import ReactResizeDetector from "react-resize-detector";
import PropTypes from "prop-types";

import blackOrWhiteContrastsMore from "../blackOrWhiteContrastsMore";
import Minimap from "../TreeMinimap";

import "./style.css";

var defaultColorCodes = ["#000000", "#8b4513", "#ff0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#EE82EE", "#808080", "#ffffff"];

/**
 * A relatively general purpose component that renders a tree in the traditional horizontal layout.
 * Key features include collapsible nodes and an optional minimap.
 *
 * @example ./HorizontalTree.md
 */
var HorizontalTree = (_temp2 = _class = function (_React$Component) {
  _inherits(HorizontalTree, _React$Component);

  function HorizontalTree() {
    var _temp, _this, _ret;

    _classCallCheck(this, HorizontalTree);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      collapsedNodes: {},
      rootRef: null
    }, _this.setRootRef = function (node) {
      return _this.setState({ rootRef: node });
    }, _this.handleResize = function () {
      return _this.forceUpdate();
    }, _this.handleExpanderClick = function (node) {
      return function () {
        var cardIdKey = _this.props.cardIdKey;

        var nodeId = get(node, cardIdKey);
        _this.setState(function (_ref) {
          var _extends2;

          var collapsedNodes = _ref.collapsedNodes;
          return {
            collapsedNodes: _extends({}, collapsedNodes, (_extends2 = {}, _extends2[nodeId] = !collapsedNodes[nodeId], _extends2))
          };
        });
      };
    }, _this.getScale = function () {
      return 1 / _this.props.zoom;
    }, _this.renderExpander = function (node, isMinimap, depth, connectorColor) {
      var _ref2;

      var _this$props = _this.props,
          childrenKey = _this$props.childrenKey,
          cardIdKey = _this$props.cardIdKey,
          connectorThickness = _this$props.connectorThickness;
      var collapsedNodes = _this.state.collapsedNodes;


      var nodeId = get(node, cardIdKey);
      var children = get(node, childrenKey, []);
      var isCollapsed = !!collapsedNodes[nodeId];
      return !!children.length && !isMinimap && React.createElement(
        "div",
        {
          style: (_ref2 = {
            position: "absolute",
            left: 0
          }, _ref2[isCollapsed ? "bottom" : "top"] = -connectorThickness, _ref2.width = "50%", _ref2.height = connectorThickness, _ref2.display = "flex", _ref2.flexDirection = "column-reverse", _ref2.cursor = "pointer", _ref2)
        },
        React.createElement(
          "div",
          {
            style: {
              position: "absolute",
              bottom: isCollapsed ? connectorThickness : null,
              right: -connectorThickness / 2,
              width: connectorThickness,
              height: connectorThickness,
              backgroundColor: connectorColor,
              color: blackOrWhiteContrastsMore(connectorColor),
              textAlign: "center",
              lineHeight: connectorThickness * 0.8 + "px",
              fontSize: connectorThickness * 1.5 + "px",
              fontWeight: 900
            },
            onClick: _this.handleExpanderClick(node)
          },
          isCollapsed ? "+" : "-"
        )
      );
    }, _this.renderLevel = function (node) {
      var isMinimap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var connectorColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (_this.props.colorCodes || defaultColorCodes)[0];
      var _this$props2 = _this.props,
          renderNode = _this$props2.renderNode,
          renderMinimapNode = _this$props2.renderMinimapNode,
          renderConnectorLabel = _this$props2.renderConnectorLabel,
          yOffsetPerUnitDepth = _this$props2.yOffsetPerUnitDepth,
          childrenKey = _this$props2.childrenKey,
          cardIdKey = _this$props2.cardIdKey,
          spaceBetweenSiblings = _this$props2.spaceBetweenSiblings,
          colorCodes = _this$props2.colorCodes,
          connectorThickness = _this$props2.connectorThickness,
          colorByDepth = _this$props2.colorByDepth;
      var collapsedNodes = _this.state.collapsedNodes;

      var actuallyRenderNode = isMinimap && renderMinimapNode || renderNode;

      var isRoot = depth === 0 && !isMinimap;
      var scale = _this.getScale();

      var nodeId = get(node, cardIdKey);
      var children = get(node, childrenKey, []);
      return React.createElement(
        "div",
        _extends({
          key: nodeId,
          style: {
            position: "relative",
            pointerEvents: isMinimap ? "none" : undefined,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: isRoot ? "min-content" : null,
            transformOrigin: "0 0",
            transform: isRoot && "scale(" + scale + ")"
          }
        }, isRoot ? { ref: _this.setRootRef } : {}),
        isRoot && React.createElement(ReactResizeDetector, {
          handleWidth: true,
          handleHeight: true,
          onResize: _this.handleResize
        }),
        React.createElement(
          "div",
          null,
          actuallyRenderNode({ node: node, depth: depth }),
          !!collapsedNodes[nodeId] && React.createElement(
            "div",
            {
              style: {
                width: "100%",
                height: connectorThickness,
                background: connectorColor
              }
            },
            _this.renderExpander(node, isMinimap, depth, connectorColor)
          )
        ),
        !!children.length && React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            style: {
              position: "relative",
              height: yOffsetPerUnitDepth,
              width: connectorThickness,
              background: connectorColor,
              display: collapsedNodes[nodeId] ? "none" : null
            }
          }),
          React.createElement(
            "div",
            {
              style: {
                position: "relative",
                flexDirection: "row",
                display: collapsedNodes[nodeId] ? "none" : "flex"
              }
            },
            children.map(function (child, i) {
              return React.createElement(
                "div",
                {
                  key: get(child, cardIdKey),
                  style: {
                    marginLeft: i === 0 ? null : spaceBetweenSiblings
                  }
                },
                _this.renderLevel(child, isMinimap, depth + 1, colorByDepth ? colorCodes[(depth + 1) % colorCodes.length] : colorCodes[i % colorCodes.length])
              );
            }),
            React.createElement(
              "div",
              {
                style: {
                  position: "absolute",
                  width: "100%",
                  height: connectorThickness,
                  top: -connectorThickness,
                  background: connectorColor
                }
              },
              renderConnectorLabel && React.createElement(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: 0,
                    bottom: connectorThickness
                  }
                },
                renderConnectorLabel({ node: node, connectorColor: connectorColor })
              )
            ),
            _this.renderExpander(node, isMinimap, depth, connectorColor)
          )
        )
      );
    }, _this.renderMinimap = function () {
      var rootRef = _this.state.rootRef;
      var rootNode = _this.props.rootNode;

      return React.createElement(
        Minimap,
        _extends({}, pick(_this.props, ["minimapViewportSelector", "minimapParentSelector", "minimapThickness", "zoom"]), {
          rootRef: rootRef,
          isHorizontal: true
        }),
        _this.renderLevel(rootNode, true)
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  HorizontalTree.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var zoom = this.props.zoom;
    var nextZoom = nextProps.zoom;

    if (zoom !== nextZoom) {
      this.needsDoubleRender = true;
    }
  };

  HorizontalTree.prototype.componentDidUpdate = function componentDidUpdate() {
    // This is a pretty hacky way of making sure everything
    // works properly in the zoom.
    if (this.needsDoubleRender) {
      this.needsDoubleRender = false;
      this.forceUpdate();
    }
  };

  HorizontalTree.prototype.render = function render() {
    var _props = this.props,
        rootNode = _props.rootNode,
        includeMinimap = _props.includeMinimap,
        marginRight = _props.marginRight,
        marginBottom = _props.marginBottom;
    var rootRef = this.state.rootRef;


    var rootBcr = rootRef && rootRef.getBoundingClientRect();
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
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

  return HorizontalTree;
}(React.Component), _class.defaultProps = {
  cardIdKey: "id",
  childrenKey: "children",
  colorCodes: defaultColorCodes,
  connectorThickness: 10,
  includeMinimap: false,
  colorByDepth: true,
  spaceBetweenSiblings: 0,
  zoom: 1,
  marginRight: 0,
  marginBottom: 0
}, _temp2);
export { HorizontalTree as default };
HorizontalTree.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * For each node, `node[idKey]` provides a unique id for each card.
   */
  cardIdKey: PropTypes.string.isRequired,

  /**
   * For each node, `node[childrenKey]` provides an array of child nodes.
   */
  childrenKey: PropTypes.string.isRequired,

  /**
   * An array of color codes to use to color in the connector lines.
   * The colors must be in hexadecimal form (e.g. `#FD04A5`.)
   */
  colorCodes: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * The thickness of the connector lines in pixels.
   */
  connectorThickness: PropTypes.number.isRequired,

  /**
   * Whether or not to include the minimap.
   */
  includeMinimap: PropTypes.bool,

  /**
   * If set to `true`, connector line colors will be colored
   * by depth in the tree. Otherwise they will be colored according
   * to their index amongst their siblings.
   */
  colorByDepth: PropTypes.bool,

  /**
   * The zoom value. Larger zoom values correspond to a more zoomed out
   * state.
   */
  zoom: PropTypes.number.isRequired,

  /**
   * The right margin of the tree in pixels.
   */
  marginRight: PropTypes.number,

  /**
   * The bottom margin of the tree in pixels.
   */
  marginBottom: PropTypes.number,

  /**
   * The root node of the tree to render.
   */
  rootNode: PropTypes.object.isRequired,

  /**
   * The function that actually renders whatever corresponds to a node.
   *
   * @param {Object} arg
   * @param {Object} arg.node The node to render.
   * @param {number} arg.depth Depth of the node.
   */
  renderNode: PropTypes.func.isRequired,

  /**
   * Render the node in the minimap, if `includeMinimap` is `true`. Defaults to `renderNode`
   * if not supplied
   *
   * @param {Object} arg
   * @param {Object} arg.node The node to render.
   * @param {number} arg.depth Depth of the node.
   */
  renderMinimapNode: PropTypes.func,

  /**
   * An optional function to render a label on the connector label lines.
   *
   * @param {Object} arg
   * @param {Object} arg.node The parent node of the connector.
   * @param {number} arg.connectorColor The color of the connector.
   */
  renderConnectorLabel: PropTypes.func,

  /**
   * The DOM element that matches this CSS selector will used to position
   * and size the viewport on the minimap. This should be the element that
   * you scroll to navigate the tree.
   */
  minimapViewportSelector: PropTypes.string,

  /**
   * The minimap will appended to the DOM element that matches this CSS selector.
   */
  minimapParentSelector: PropTypes.string,

  /**
   * The height of the minimap in pixels.
   */
  minimapThickness: PropTypes.number,

  /**
   * The minimum horizontal space, in pixels, to put between sibling cards.
   */
  spaceBetweenSiblings: PropTypes.number.isRequired,

  /**
   * The vertical space, in pixels, between levels.
   */
  yOffsetPerUnitDepth: PropTypes.number.isRequired
} : {};