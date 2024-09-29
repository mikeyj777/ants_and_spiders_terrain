import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';

extend({ OrbitControls });

const NUM_ANTS = 20;
const NUM_SPIDERS = 3; 

const ForestModel = () => {
  const [error, setError] = useState(null);
  
  const gltf = useLoader(
    GLTFLoader, 
    'data/forest_3d_model.glb',
    undefined,
    (error) => {
      console.error('Error loading 3D model:', error);
      setError(error);
    }
  );

  useEffect(() => {
    if (gltf) {
      console.log('GLB file loaded successfully:', gltf);
    }
  }, [gltf]);

  if (error) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <text position={[0, 1.5, 0]} fontSize={0.2} color="white">
          Error loading model
        </text>
      </group>
    );
  }

  return <primitive object={gltf.scene} />;
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  
  return <orbitControls args={[camera, domElement]} />;
};

const Scene = () => {
  const [spiders, setSpiders] = useState([]);
  const [ants, setAnts] = useState([]);
  const [pheromones, setPheromones] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialSpiders = Array.from({ length: NUM_SPIDERS }, (_, i) => {
      const position = new Vector3(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      return new Spider(i, position);
    });

    const initialAnts = Array.from({ length: NUM_ANTS }, (_, i) => {
      const position = new Vector3(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      return new Ant(i, position);
    });

    setSpiders(initialSpiders);
    setAnts(initialAnts);
    setIsInitialized(true);
  }, []);

  useFrame(() => {
    if (!isInitialized) return;

    setAnts(prevAnts => 
      prevAnts.map(ant => {
        ant.move();
        ant.followPheromone(pheromones);
        ant.leavePheromone(pheromones);
        return ant;
      })
    );

    setSpiders(prevSpiders => 
      prevSpiders.map(spider => {
        spider.move();
        spider.hunt(ants);
        return spider;
      })
    );

    setPheromones(prevPheromones =>
      prevPheromones.filter(pheromone =>
        pheromone.distanceTo(ants[0].position) < 10
      )
    );
  });

  if (!isInitialized) return null;

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

      {spiders.map(spider => (
        <mesh key={spider.id} position={spider.position}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="black" />
        </mesh>
      ))}

      {ants.map(ant => (
        <mesh key={ant.id} position={ant.position}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color={ant.color} />
        </mesh>
      ))}

      <CameraControls />
    </>
  );
};

const Model = () => {
  return (
    <Canvas style={{ width: '100%', height: '400px' }}>
      <Scene />
    </Canvas>
  );
};

export default Model;