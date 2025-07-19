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
import { buildEquation } from './utils/generateEquation';

const nodeTypes = { logic: LogicNode };
const gateTypes = ['AND','OR','NAND','NOR','XOR','NOT'];

function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [eqn, setEqn] = useState('');

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

      const label = event.dataTransfer.getData('application/reactflow');
      if (!label) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });
      const id = `${label}_${+new Date()}`;

      const newNode = {
        id,
        type: 'logic',
        position,
        data: { label },
      };

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