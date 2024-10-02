// File: components/ForestModel.js
import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

export default ForestModel;