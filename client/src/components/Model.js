import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three-stdlib/controls/OrbitControls';
import { Vector3 } from 'three';
import { Agent, Spider, Ant } from './AgentClasses';

const NUM_ANTS = 20;
const NUM_SPIDERS = 3; 

const ForestModel = () => {
  const gltf = useLoader(GLTFLoader, '../data/forest_3d_model.glb');
  
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  const [spiders, setSpiders] = useState([]);
  const [ants, setAnts] = useState([]);
  const [pheromones, setPheromones] = useState([]);

  useEffect(() => {
    const initialSpiders = [];
    const initialAnts = [];

    for (let i = 0; i < NUM_SPIDERS; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      initialSpiders.push(new Spider(i, position));
    }

    for (let i = 0; i < NUM_ANTS; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      initialAnts.push(new Ant(i, position));
    }

    setSpiders(initialSpiders);
    setAnts(initialAnts);
  }, []);

  useFrame(() => {
    const newAnts = ants.map(ant => {
      ant.move();
      ant.followPheromone(pheromones);
      ant.leavePheromone(pheromones);
      return ant;
    });

    const newSpiders = spiders.map(spider => {
      spider.move();
      spider.hunt(newAnts);
      return spider;
    });

    setPheromones(prevPheromones =>
      prevPheromones.filter(pheromone =>
        pheromone.distanceTo(newAnts[0].position) < 10
      )
    );
    setAnts(newAnts);
    setSpiders(newSpiders);
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />

      <ForestModel />

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

      <primitive object={new OrbitControls()} />
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