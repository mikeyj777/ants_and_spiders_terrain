import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';
import ForestModel from './ForestModel';
import Scene from './Scene'

extend({ OrbitControls });


const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  
  return <orbitControls args={[camera, domElement]} />;
};

const ModelEngine = () => {
  return (
    <Canvas style={{ width: '100%', height: '400px' }}>
      <Scene />
    </Canvas>
  );
};

export default ModelEngine;