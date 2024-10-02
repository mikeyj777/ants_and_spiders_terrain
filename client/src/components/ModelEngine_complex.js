// ModelEngine.js (or your main component file)
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

const PositionOverlay = ({ position }) => {
  if (!position) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '5px',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      zIndex: 1000,
    }}>
      X: {position.x.toFixed(2)}, Y: {position.y.toFixed(2)}, Z: {position.z.toFixed(2)}
    </div>
  );
};

const ModelEngine = () => {
  const [cursorPosition, setCursorPosition] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Canvas>
        <Scene onCursorPositionChange={setCursorPosition} />
      </Canvas>
      <PositionOverlay position={cursorPosition} />
    </div>
  );
};

export default ModelEngine;