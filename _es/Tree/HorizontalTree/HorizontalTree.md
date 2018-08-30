A basic example of the horizontal tree:

```jsx
<HorizontalTree
  renderNode={({ node }) => (
    <div className="horizontal-tree-demo-node">{node.name}</div>
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
  yOffsetPerUnitDepth={50}
  spaceBetweenSiblings={25}
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
  <div id="horizontal-demo-minimap-parent" />
  <div id="horizontal-demo-minimap-viewport">
    <HorizontalTree
      renderNode={({ node }) => (
        <div className="horizontal-tree-demo-node">{node.name}</div>
      )}
      rootNode={createTree(5)}
      yOffsetPerUnitDepth={50}
      spaceBetweenSiblings={25}
      includeMinimap
      minimapParentSelector="#horizontal-demo-minimap-parent"
      minimapViewportSelector="#horizontal-demo-minimap-viewport"
      minimapThickness={50}
    />
  </div>
</div>
```
