render(() => (
  <div>
    <h5>Basic Horizontal Tree</h5>
    <Tree
      layout="horizontal"
      renderNode={({ node }) => (
        <div className="horizontal-tree-demo-node">{node.name}</div>
      )}
      rootNode={smallTreeData}
      yOffsetPerUnitDepth={50}
      spaceBetweenSiblings={25}
    />
    <h5>Minimap with a Large Horizontal Tree </h5>
    <div>
      <div id="horizontal-demo-minimap-parent" />
      <div id="horizontal-demo-minimap-viewport">
        <Tree
          layout="horizontal"
          renderNode={({ node }) => (
            <div className="horizontal-tree-demo-node">{node.name}</div>
          )}
          rootNode={bigTreeData}
          yOffsetPerUnitDepth={50}
          spaceBetweenSiblings={25}
          includeMinimap
          minimapParentSelector="#horizontal-demo-minimap-parent"
          minimapViewportSelector="#horizontal-demo-minimap-viewport"
          minimapThickness={50}
        />
      </div>
    </div>
    <h5>Basic Vertical Tree</h5>
    <Tree
      layout="vertical"
      renderNode={({ node }) => (
        <div className="vertical-tree-demo-node">{node.name}</div>
      )}
      xOffsetPerUnitDepth={50}
      rootNode={smallTreeData}
    />
    <h5>Minimap with a Large Vertical Tree </h5>
    <div>
      <div id="vertical-demo-minimap-parent" />
      <div id="vertical-demo-minimap-viewport">
        <Tree
          layout="vertical"
          renderNode={({ node }) => (
            <div className="vertical-tree-demo-node">{node.name}</div>
          )}
          rootNode={bigTreeData}
          xOffsetPerUnitDepth={50}
          includeMinimap
          minimapParentSelector="#vertical-demo-minimap-parent"
          minimapViewportSelector="#vertical-demo-minimap-viewport"
          minimapThickness={50}
        />
      </div>
    </div>
  </div>
));
