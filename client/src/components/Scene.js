import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler, DataTexture, RGBAFormat, PlaneGeometry, MeshBasicMaterial } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';
import { createInitialAgents, moveAgent } from '../utils/agentUtils';
import ForestModel from './ForestModel';
import CameraControls from './CameraControls';
import { agentToModelCoordinates } from '../utils/transform';

// Adjustable variables
const BOX_ROTATION_DEGREES = 35;
const BOX_SIZE = 45;
const BOX_HEIGHT = 10;
const BOX_ROTATION = BOX_ROTATION_DEGREES * (Math.PI / 180); // in radians
const LOWEST_ELEVATION = -5;
const ANCHOR_POINT = new Vector3(-7, LOWEST_ELEVATION, -30); // Bottom corner of the box

const AlignedBoundingBox = ({ size, height, rotation, anchorPoint }) => {
  const halfSize = size / 2;
  const boxCenter = new Vector3(
    anchorPoint.x + halfSize,
    anchorPoint.y + height / 2,
    anchorPoint.z + halfSize
  );

  return (
    <mesh 
      position={boxCenter} 
      rotation={new Euler(0, rotation, 0)}
    >
      <boxGeometry args={[size, height, size]} />
      <meshBasicMaterial color="red" wireframe={true} />
    </mesh>
  );
};

const Scene = () => {
  const [agentPosition, setAgentPosition] = useState(new Vector3(0, 10, 0));
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

      <AlignedBoundingBox 
        size={BOX_SIZE} 
        height={BOX_HEIGHT} 
        rotation={BOX_ROTATION} 
        anchorPoint={ANCHOR_POINT}
      />

      <CameraControls />
    </>
  );
};

export default Scene;