import React from "react";
import { get, pick } from "lodash";
import ReactResizeDetector from "react-resize-detector";
import PropTypes from "prop-types";
import Minimap from "../TreeMinimap";
import blackOrWhiteContrastsMore from "../blackOrWhiteContrastsMore";
import { Tooltip } from "@blueprintjs/core";

import "./style.css";

const defaultColorCodes = [
  "#000000",
  "#8b4513",
  "#ff0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#EE82EE",
  "#808080",
  "#ffffff"
];

/**
 * A relatively general purpose component that renders a tree in a vertical layout.
 * Key features include collapsible nodes and an optional minimap.
 *
 * @example ./VerticalTree.md
 */
export default class VerticalTree extends React.Component {
  state = {
    collapsedNodes: {}
  };

  static defaultProps = {
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
  };

  static propTypes = {
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
     * How much to indent each level of the tree, in pixels.
     */
    xOffsetPerUnitDepth: PropTypes.number.isRequired,

    /**
     * Whether to render leaf cards in a horizontal line or vertically, like the other nodes.
     */
    horizontalLeaves: PropTypes.bool
  };

  handleExpanderClick = node => () => {
    const { cardIdKey } = this.props;
    const nodeId = get(node, cardIdKey);
    this.setState(({ collapsedNodes }) => ({
      collapsedNodes: {
        ...collapsedNodes,
        [nodeId]: !collapsedNodes[nodeId]
      }
    }));
  };

  setRootRef = node => this.setState({ rootRef: node });

  getScale = () => 1 / this.props.zoom;

  handleResize = () => this.forceUpdate();

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { zoom } = this.props;
    const { zoom: nextZoom } = nextProps;
    if (zoom !== nextZoom) {
      this.needsDoubleRender = true;
    }
  }

  componentDidUpdate() {
    // This is a pretty hacky way of making sure everything
    // works properly in the zoom.
    if (this.needsDoubleRender) {
      this.needsDoubleRender = false;
      this.forceUpdate();
    }
  }

  renderLevel = (
    node,
    isMinimap = false,
    depth = 0,
    connectorColor = (this.props.colorCodes || defaultColorCodes)[0]
  ) => {
    const {
      renderNode,
      renderMinimapNode,
      renderConnectorLabel,
      childrenKey,
      cardIdKey,
      xOffsetPerUnitDepth,
      colorCodes,
      connectorThickness,
      horizontalLeaves,
      colorByDepth
    } = this.props;
    const { collapsedNodes } = this.state;
    const connectXSize = xOffsetPerUnitDepth - connectorThickness;

    const actuallyRenderNode = (isMinimap && renderMinimapNode) || renderNode;

    const isRoot = depth === 0 && !isMinimap;

    const nodeId = get(node, cardIdKey);
    const children = get(node, childrenKey, []);
    return (
      <div
        key={nodeId}
        style={{
          position: "relative",
          pointerEvents: isMinimap ? "none" : undefined,
          width: isRoot ? "min-content" : null,
          transformOrigin: "0 0",
          transform: isRoot && `scale(${this.getScale()})`
        }}
        {...(isRoot ? { ref: this.setRootRef } : {})}
      >
        {isRoot && (
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={this.handleResize}
          />
        )}
        <div style={{ marginLeft: connectorThickness }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: -connectorThickness,
                borderLeft: `${connectorThickness}px solid ${connectorColor}`,
                // If the component has any children, we will need to make this line extend
                // down a little extra to overcome any gap between this card and its children.
                height:
                  children.length && !collapsedNodes[nodeId] ? "125%" : "100%"
              }}
            />
            {!!children.length &&
              !isMinimap && (
                <div
                  style={{
                    position: "absolute",
                    left: -connectorThickness,
                    width: connectorThickness,
                    height: "50%",
                    display: "flex",
                    flexDirection: "column-reverse",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: -connectorThickness + "px",
                      left: -connectorThickness * 0.4 + "px",
                      width: connectorThickness * 2 + "px",
                      height: connectorThickness * 2 + "px",
                      borderRadius: connectorThickness + "px",
                      paddingTop: connectorThickness * 0.6 + "px",
                      backgroundColor: connectorColor,
                      color: blackOrWhiteContrastsMore(connectorColor),
                      textAlign: "center",
                      lineHeight: connectorThickness + "px",
                      fontSize: connectorThickness * 1.2 + "px",
                      boxShadow: "0 0 1px #0006 inset"
                    }}
                    onClick={this.handleExpanderClick(node)}
                  >
                    <Tooltip
                      content={
                        collapsedNodes[nodeId] ? "Expand node" : "Collapse node"
                      }
                    >
                      <span>{collapsedNodes[nodeId] ? "►" : "▼"}</span>
                    </Tooltip>
                  </div>
                </div>
              )}
            {actuallyRenderNode({ node, depth })}
          </div>
          {!!children.length && (
            <div
              style={{
                marginLeft: xOffsetPerUnitDepth,
                position: "relative",
                display: collapsedNodes[nodeId] ? "none" : undefined
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -xOffsetPerUnitDepth - connectorThickness,
                  height: "50%",
                  borderLeft: `${connectorThickness}px solid ${connectorColor}`,
                  width: connectXSize,
                  borderBottom: `${connectorThickness}px solid ${connectorColor}`
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left:
                    -xOffsetPerUnitDepth - connectorThickness + connectXSize,
                  height: "100%",
                  borderLeft: `${connectorThickness}px solid ${connectorColor}`
                }}
              />
              {renderConnectorLabel && (
                <div
                  style={{
                    position: "relative",
                    left: -xOffsetPerUnitDepth + connectXSize
                  }}
                >
                  {renderConnectorLabel({ node, connectorColor })}
                </div>
              )}
              {horizontalLeaves && this.areChildNodesAllLeaves(node)
                ? this.renderHorizontalLeaves(
                    children,
                    isMinimap,
                    depth,
                    colorCodes
                  )
                : children.map((child, i) =>
                    this.renderLevel(
                      child,
                      isMinimap,
                      depth + 1,
                      colorByDepth
                        ? colorCodes[(depth + 1) % colorCodes.length]
                        : colorCodes[i % colorCodes.length]
                    )
                  )}
            </div>
          )}
        </div>
      </div>
    );
  };

  renderHorizontalLeaves = (nodes, isMinimap, depth, colorCodes) => {
    const {
      renderNode,
      renderMinimapNode,
      cardIdKey,
      connectorThickness,
      colorByDepth
    } = this.props;
    const actuallyRenderNode = (isMinimap && renderMinimapNode) || renderNode;

    return (
      <div
        style={{
          position: "relative",
          pointerEvents: isMinimap ? "none" : undefined,
          display: "flex",
          transformOrigin: "0 0"
        }}
      >
        {nodes.map((node, i) => {
          const nodeId = get(node, cardIdKey);
          const connectorColor = colorByDepth
            ? colorCodes[(depth + 1) % colorCodes.length]
            : colorCodes[i % colorCodes.length];

          return (
            <div key={nodeId} style={{ marginLeft: connectorThickness }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -connectorThickness,
                    borderLeft: `${connectorThickness}px solid ${connectorColor}`,
                    height: "100%"
                  }}
                />
                {actuallyRenderNode({ node, depth })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  areChildNodesAllLeaves = node => {
    const { childrenKey } = this.props;
    const children = get(node, childrenKey, []);
    return children.every(child => get(child, childrenKey, []).length === 0);
  };

  renderMinimap = () => {
    const { rootRef } = this.state;
    const { rootNode } = this.props;
    return (
      <Minimap
        {...{
          ...pick(this.props, [
            "minimapViewportSelector",
            "minimapThickness",
            "minimapParentSelector",
            "zoom"
          ]),
          rootRef,
          isHorizontal: false
        }}
      >
        {this.renderLevel(rootNode, true)}
      </Minimap>
    );
  };

  render() {
    const { rootNode, includeMinimap, marginBottom, marginRight } = this.props;
    const { rootRef } = this.state;
    const rootBcr = rootRef && rootRef.getBoundingClientRect();
    return (
      <React.Fragment>
        <div
          style={{
            overflow: "hidden",
            height: rootRef && rootBcr.height + marginBottom,
            width: rootRef && rootBcr.width + marginRight
          }}
        >
          {this.renderLevel(rootNode)}
        </div>
        {!!includeMinimap && this.renderMinimap()}
      </React.Fragment>
    );
  }
}
