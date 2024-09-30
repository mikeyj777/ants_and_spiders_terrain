// File: components/ForestModel.js
import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ForestModel = () => {
  const gltf = useLoader(GLTFLoader, '/data/forest_3d_model.glb');
  
  useEffect(() => {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, 0, 0);
  }, [gltf]);

  return <primitive object={gltf.scene} />;
};

export default ForestModel;