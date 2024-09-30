import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Terrain from './Terrain';
import Boundary from './Boundary';
import CameraControls from './CameraControls';

const Scene = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <Physics>
        <Terrain />
        <Boundary position={[0, 0, -10]} rotation={[-Math.PI / 2, 0, 0]} />
        <Boundary position={[0, 0, 10]} rotation={[Math.PI / 2, 0, 0]} />
        <Boundary position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Boundary position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </Physics>
      <CameraControls />
    </>
  );
};

export default Scene;