import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls } from 'reactflow';
import LogicNode from './nodeTypes/LogicNode';
import { buildEquation } from './utils/generateEquation';

const nodeTypes = { logic: LogicNode };
const gateTypes = ['AND','OR','NAND','NOR','XOR','NOT'];

function App() {
  const [elements, setElements] = useState([]);
  const [eqn, setEqn] = useState('');

  const onConnect = useCallback(
    params => setElements(els => addEdge(params, els)),
    []
  );

  const addGate = label => {
    const id = `${label}_${+new Date()}`;
    setElements(es => [
      ...es,
      {
        id,
        type: 'logic',
        position: { x: 250, y: 50 + es.length * 70 },
        data: { label }
      }
    ]);
  };

  const generate = () => {
    const nodes = elements.filter(e => e.id && !e.source);
    const edges = elements.filter(e => e.source);
    setEqn(buildEquation(nodes, edges));
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="description">Drag gates onto canvas:</div>
        {gateTypes.map(g => (
          <button key={g} onClick={() => addGate(g)}>{g}</button>
        ))}
        <div className="description">Then connect and click:</div>
        <button onClick={generate}>Generate Equation</button>
        <div style={{ marginTop: 20, fontSize: 14 }}>
          <strong>Equation:</strong>
          <div style={{ wordBreak: 'break-all' }}>{eqn}</div>
        </div>
      </div>
      <div className="reactflow-wrapper">
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;