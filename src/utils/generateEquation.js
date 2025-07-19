export function buildEquation(nodes, edges) {
  const map = {};
  nodes.forEach(n => (map[n.id] = n));

  // recursive traversal
  function recurse(id) {
    const node = map[id];
    if (node.type === 'input') {
      return node.data.label;
    }
    const inEdges = edges.filter(e => e.target === id);
    if (node.data.label === 'NOT') {
      const input = inEdges[0]?.source;
      return `¬(${recurse(input)})`;
    }
    const inputs = inEdges.map(e => recurse(e.source));
    const symbol = {
      AND: '∧', OR: '∨', NAND: '⊼', NOR: '⊽', XOR: '⊕'
    }[node.data.label];
    return `(${inputs.join(` ${symbol} `)})`;
  }

  // find sinks (nodes with no outgoing edges)
  const sinks = nodes.filter(n => !edges.some(e => e.source === n.id));
  return sinks.map(s => recurse(s.id)).join(' ∧ ');
}