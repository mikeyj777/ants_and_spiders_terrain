import React, { useState, useCallback } from 'react';
import { Physics } from '@react-three/cannon';
import ForestModel from './ForestModel';
import TerrainModel from './TerrainModel';
import CameraControls from './CameraControls';

const Scene = () => {
  const [gltfData, setGltfData] = useState(null);

  const handleModelLoaded = useCallback((loadedGltf) => {
    setGltfData(loadedGltf);
    console.log('Model loaded:', loadedGltf);
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} castShadow />
      
      <Physics>
        <ForestModel onModelLoaded={handleModelLoaded} />
        {gltfData && <TerrainModel gltfData={gltfData} />}
        {/* Add your agents and other objects here */}
      </Physics>

      <CameraControls />
    </>
  );
};

export default Scene;