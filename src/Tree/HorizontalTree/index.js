import React from "react";
import { get, pick } from "lodash";
import ReactResizeDetector from "react-resize-detector";
import PropTypes from "prop-types";

import blackOrWhiteContrastsMore from "../blackOrWhiteContrastsMore";
import Minimap from "../TreeMinimap";

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
 * A relatively general purpose component that renders a tree in the traditional horizontal layout.
 * Key features include collapsible nodes and an optional minimap.
 *
 * @example ./HorizontalTree.md
 */
export default class HorizontalTree extends React.Component {
  state = {
    collapsedNodes: {},
    rootRef: null
  };

  static defaultProps = {
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
     * The minimum horizontal space, in pixels, to put between sibling cards.
     */
    spaceBetweenSiblings: PropTypes.number.isRequired,

    /**
     * The vertical space, in pixels, between levels.
     */
    yOffsetPerUnitDepth: PropTypes.number.isRequired
  };

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

  setRootRef = node => this.setState({ rootRef: node });

  handleResize = () => this.forceUpdate();

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

  getScale = () => 1 / this.props.zoom;

  renderExpander = (node, isMinimap, depth, connectorColor) => {
    const { childrenKey, cardIdKey, connectorThickness } = this.props;
    const { collapsedNodes } = this.state;

    const nodeId = get(node, cardIdKey);
    const children = get(node, childrenKey, []);
    const isCollapsed = !!collapsedNodes[nodeId];
    return (
      !!children.length &&
      !isMinimap && (
        <div
          style={{
            position: "absolute",
            left: 0,
            [isCollapsed ? "bottom" : "top"]: -connectorThickness,
            width: "50%",
            height: connectorThickness,
            display: "flex",
            flexDirection: "column-reverse",
            cursor: "pointer"
          }}
        >
          <div
            style={{
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
            }}
            onClick={this.handleExpanderClick(node)}
          >
            {isCollapsed ? "+" : "-"}
          </div>
        </div>
      )
    );
  };

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
      yOffsetPerUnitDepth,
      childrenKey,
      cardIdKey,
      spaceBetweenSiblings,
      colorCodes,
      connectorThickness,
      colorByDepth
    } = this.props;
    const { collapsedNodes } = this.state;
    const actuallyRenderNode = (isMinimap && renderMinimapNode) || renderNode;

    const isRoot = depth === 0 && !isMinimap;
    const scale = this.getScale();

    const nodeId = get(node, cardIdKey);
    const children = get(node, childrenKey, []);
    return (
      <div
        key={nodeId}
        style={{
          position: "relative",
          pointerEvents: isMinimap ? "none" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isRoot ? "min-content" : null,
          transformOrigin: "0 0",
          transform: isRoot && `scale(${scale})`
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
        <div>
          {actuallyRenderNode({ node, depth })}
          {!!collapsedNodes[nodeId] && (
            <div
              style={{
                width: "100%",
                height: connectorThickness,
                background: connectorColor
              }}
            >
              {this.renderExpander(node, isMinimap, depth, connectorColor)}
            </div>
          )}
        </div>

        {!!children.length && (
          <React.Fragment>
            <div
              style={{
                position: "relative",
                height: yOffsetPerUnitDepth,
                width: connectorThickness,
                background: connectorColor,
                display: collapsedNodes[nodeId] ? "none" : null
              }}
            />
            <div
              style={{
                position: "relative",
                flexDirection: "row",
                display: collapsedNodes[nodeId] ? "none" : "flex"
              }}
            >
              {children.map((child, i) => (
                <div
                  key={get(child, cardIdKey)}
                  style={{
                    marginLeft: i === 0 ? null : spaceBetweenSiblings
                  }}
                >
                  {this.renderLevel(
                    child,
                    isMinimap,
                    depth + 1,
                    colorByDepth
                      ? colorCodes[(depth + 1) % colorCodes.length]
                      : colorCodes[i % colorCodes.length]
                  )}
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: connectorThickness,
                  top: -connectorThickness,
                  background: connectorColor
                }}
              >
                {renderConnectorLabel && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: connectorThickness
                    }}
                  >
                    {renderConnectorLabel({ node, connectorColor })}
                  </div>
                )}
              </div>
              {this.renderExpander(node, isMinimap, depth, connectorColor)}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  };

  renderMinimap = () => {
    const { rootRef } = this.state;
    const { rootNode } = this.props;
    return (
      <Minimap
        {...{
          ...pick(this.props, [
            "minimapViewportSelector",
            "minimapParentSelector",
            "minimapThickness",
            "zoom"
          ]),
          rootRef,
          isHorizontal: true
        }}
      >
        {this.renderLevel(rootNode, true)}
      </Minimap>
    );
  };

  render() {
    const { rootNode, includeMinimap, marginRight, marginBottom } = this.props;
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
