A basic example of the vertical tree:

```jsx
<VerticalTree
  renderNode={({ node }) => (
    <div className="vertical-tree-demo-node">{node.name}</div>
  )}
  rootNode={{
    id: 'A',
    name: 'A',
    children: [
      {
        id: 'B',
        name: 'B',
        children: [{ id: 'D', name: 'D' }, { id: 'E', name: 'E' }]
      },
      {
        id: 'C',
        name: 'C',
        children: [{ id: 'F', name: 'F' }, { id: 'G', name: 'G' }]
      }
    ]
  }}
  xOffsetPerUnitDepth={50}
/>
```

An example of the minimap with a large tree:

```jsx
let id = 0
function createTree(maxDepth, depth = 0) {
  const node = { name: ++id, id, children: [] }
  if (depth <= maxDepth) {
    for (let i = 0; i < 2; i++)
      node.children.push(createTree(maxDepth, depth + 1))
  }
  return node
}

;<div>
  <div id="vertical-demo-minimap-parent" />
  <div id="vertical-demo-minimap-viewport">
    <VerticalTree
      renderNode={({ node }) => (
        <div className="vertical-tree-demo-node">{node.name}</div>
      )}
      rootNode={createTree(5)}
      xOffsetPerUnitDepth={50}
      includeMinimap
      minimapParentSelector="#vertical-demo-minimap-parent"
      minimapViewportSelector="#vertical-demo-minimap-viewport"
      minimapThickness={50}
    />
  </div>
</div>
```
