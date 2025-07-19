import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';
import LogicNode from './nodeTypes/LogicNode';
import InputNode from './nodeTypes/InputNode';
import { buildEquation } from './utils/generateEquation';

const nodeTypes = { logic: LogicNode, input: InputNode };
const gateTypes = ['AND','OR','NAND','NOR','XOR','NOT','INPUT'];

function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [eqn, setEqn] = useState('');
  const idRef = useRef(0);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragStart = (event, label) => {
    event.dataTransfer.setData('application/reactflow', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });

      const id = `${type}_${Date.now()}_${idRef.current++}`;

      let newNode;
      if (type === 'INPUT') {
        const name = window.prompt('Input name', 'A');
        if (!name) return;
        newNode = {
          id,
          type: 'input',
          position,
          data: { label: name },
        };
      } else {
        newNode = {
          id,
          type: 'logic',
          position,
          data: { label: type },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const generate = () => {
    setEqn(buildEquation(nodes, edges));
  };

  const saveDesign = () => {
    localStorage.setItem('design', JSON.stringify({ nodes, edges }));
    alert('Design saved');
  };

  const loadDesign = () => {
    const data = localStorage.getItem('design');
    if (data) {
      const { nodes: n, edges: e } = JSON.parse(data);
      setNodes(n);
      setEdges(e);
    }
  };

  const clearDesign = () => {
    setNodes([]);
    setEdges([]);
    setEqn('');
  };

  return (
    <ReactFlowProvider>
      <div className="container">
      <div className="sidebar">
        <div className="description">Drag gates onto canvas:</div>
        {gateTypes.map((g) => (
          <div
            key={g}
            className="dndnode"
            onDragStart={(e) => onDragStart(e, g)}
            draggable
          >
            {g}
          </div>
        ))}
        <div className="description">Then connect and click:</div>
        <button onClick={generate}>Generate Equation</button>
        <button onClick={saveDesign}>Save</button>
        <button onClick={loadDesign}>Load</button>
        <button onClick={clearDesign}>Clear</button>
        <div style={{ marginTop: 20, fontSize: 14 }}>
          <strong>Equation:</strong>
          <div style={{ wordBreak: 'break-all' }}>{eqn}</div>
        </div>
      </div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
          onInit={setReactFlowInstance}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
    </ReactFlowProvider>
  );
}

export default App;