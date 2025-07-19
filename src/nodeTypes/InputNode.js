import React from 'react';
import { Handle } from 'reactflow';

export default function InputNode({ data }) {
  return (
    <div style={{
      padding: 10,
      border: '2px solid #2c7',
      borderRadius: 5,
      background: '#e8f5e9',
      textAlign: 'center',
      minWidth: 60,
    }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>Input</div>
      <div style={{ fontSize: 20, fontWeight: 'bold' }}>{data.label}</div>
      <Handle type="source" position="bottom" style={{ background: '#2c7' }} />
    </div>
  );
}
