import React from 'react';
import { Handle } from 'reactflow';

const gateShapes = {
  AND: '∧',
  OR: '∨',
  NAND: '⊼',
  NOR: '⊽',
  XOR: '⊕',
  NOT: '¬'
};

export default function LogicNode({ data }) {
  return (
    <div style={{
      padding: 10,
      border: '2px solid #555',
      borderRadius: 5,
      background: '#f9f9f9',
      textAlign: 'center',
      minWidth: 60
    }}>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <div style={{ fontSize: 24 }}>{gateShapes[data.label]}</div>
      <div style={{ fontSize: 12 }}>{data.label}</div>
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
}