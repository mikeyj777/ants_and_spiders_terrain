import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler, DataTexture, RGBAFormat, PlaneGeometry, MeshBasicMaterial } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';
import { createInitialAgents, moveAgent } from '../utils/agentUtils';
import ForestModel from './ForestModel';
import CameraControls from './CameraControls';
import { agentToModelCoordinates } from '../utils/transform';


const Scene = () => {
  const [agentPosition, setAgentPosition] = useState(new Vector3(100, 10, 0));
  const [modelPosition, setModelPosition] = useState(new Vector3(0, 10, 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentPosition(prevPos => {
        const newPos = moveAgent(prevPos);
        const newModelPos = agentToModelCoordinates(newPos);
        setModelPosition(newModelPos);
        return newPos;
      });
    }, 500); // Move every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      }>
        <ForestModel />
      </Suspense>

      <mesh position={modelPosition}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <CameraControls />
    </>
  );
};

export default Scene;