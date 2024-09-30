// File: ModelEngine.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

const ModelEngine = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
      <Scene />
    </Canvas>
  </div>
);

export default ModelEngine;