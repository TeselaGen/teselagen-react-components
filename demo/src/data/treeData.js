export const smallTreeData = {
  id: "A",
  name: "A",
  children: [
    {
      id: "B",
      name: "B",
      children: [{ id: "D", name: "D" }, { id: "E", name: "E" }]
    },
    {
      id: "C",
      name: "C",
      children: [{ id: "F", name: "F" }, { id: "G", name: "G" }]
    }
  ]
};

let id = 0;
function createTree(maxDepth, depth = 0) {
  const node = { name: ++id, id, children: [] };
  if (depth <= maxDepth) {
    for (let i = 0; i < 2; i++)
      node.children.push(createTree(maxDepth, depth + 1));
  }
  return node;
}

export const bigTreeData = createTree(5);
