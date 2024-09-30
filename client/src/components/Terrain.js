// File: components/Terrain.js
import React from 'react';
import { usePlane } from '@react-three/cannon';
import ForestModel from './ForestModel';

const Terrain = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));
  return (
    <group ref={ref}>
      <ForestModel />
    </group>
  );
};

export default Terrain;