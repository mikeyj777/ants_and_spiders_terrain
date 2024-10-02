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

const CoordinateDisplay = ({ position }) => {
  const meshRef = useRef();
  const textureRef = useRef();
  const { camera } = useThree();

  const texture = useMemo(() => {
    const width = 256;
    const height = 64;
    const size = width * height;
    const data = new Uint8Array(4 * size);
    const texture = new DataTexture(data, width, height, RGBAFormat);
    textureRef.current = texture;
    return texture;
  }, []);

  useEffect(() => {
    if (!textureRef.current) return;

    const { data } = textureRef.current.image;
    const width = textureRef.current.image.width;

    // Fill with a semi-transparent black background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;     // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
      data[i + 3] = 128; // A (semi-transparent)
    }
    
    // Simple text rendering (very basic, just for demonstration)
    const text = `X: ${position.x.toFixed(2)}, Z: ${position.z.toFixed(2)}`;
    const x = 10, y = 30;
    for (let i = 0; i < text.length; i++) {
      const ix = (x + i * 10) + (y * width);
      data[ix * 4] = 255;     // R
      data[ix * 4 + 1] = 255; // G
      data[ix * 4 + 2] = 255; // B
      data[ix * 4 + 3] = 255; // A
    }
    
    textureRef.current.needsUpdate = true;
  }, [position]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position).add(camera.getWorldDirection(new Vector3()).multiplyScalar(-5));
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 0.5]} />
      <meshBasicMaterial map={texture} transparent={true} />
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
      <CoordinateDisplay position={agentPosition} />
    </>
  );
};

export default Scene;