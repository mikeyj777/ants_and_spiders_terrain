import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';
import { createInitialAgents } from '../utils/agentUtils';
import ForestModel from './ForestModel';
import CameraControls from './CameraControls';

const Scene = () => {
  const [agents, setAgents] = useState({ spiders: [], ants: [] });

  useEffect(() => {
    setAgents(createInitialAgents());
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

      {agents.spiders.map(spider => (
        <mesh key={spider.id} position={spider.position}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="black" />
        </mesh>
      ))}

      {agents.ants.map(ant => (
        <mesh key={ant.id} position={ant.position}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color={ant.color} />
        </mesh>
      ))}

      <CameraControls />
    </>
  );
};
export default Scene;