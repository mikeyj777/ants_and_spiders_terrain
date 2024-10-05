import React, { useEffect, useState } from 'react';
import { useCompoundBody } from '@react-three/cannon';
import * as THREE from 'three';

const TerrainModel = ({ gltfData }) => {
  const [processedTerrain, setProcessedTerrain] = useState(null);

  useEffect(() => {
    if (gltfData) {
      console.log('GLTF Data received:', gltfData);
      const terrain = gltfData.scene.children.find(child => child.isMesh);
      if (terrain) {
        console.log('Terrain mesh found:', terrain);
        const processedData = processTerrainData(terrain);
        setProcessedTerrain(processedData);
        console.log('Processed terrain data:', processedData);
      } else {
        console.warn('No terrain mesh found in GLTF data');
      }
    }
  }, [gltfData]);

  const processTerrainData = (terrainMesh) => {
    const geometry = terrainMesh.geometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    console.log('Terrain bounding box:', box);

    const shapes = [];
    const segments = 20;
    const size = {
      x: (box.max.x - box.min.x) / segments,
      y: (box.max.y - box.min.y),
      z: (box.max.z - box.min.z) / segments
    };
    console.log('Segment size:', size);

    for (let x = 0; x < segments; x++) {
      for (let z = 0; z < segments; z++) {
        const posX = box.min.x + size.x * (x + 0.5);
        const posZ = box.min.z + size.z * (z + 0.5);
        const height = getTerrainHeight(geometry, posX, posZ);
        const posY = box.min.y + height / 2;

        shapes.push({
          type: 'Box',
          args: [size.x, height, size.z],
          position: [posX, posY, posZ]
        });

        if (x === 0 && z === 0) {
          console.log('Sample shape:', shapes[shapes.length - 1]);
        }
      }
    }

    console.log(`Generated ${shapes.length} shapes for terrain physics`);

    return {
      shapes: shapes,
      originalGeometry: geometry
    };
  };

  const getTerrainHeight = (geometry, x, z) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3(0, -1, 0);
    const far = 1000;

    raycaster.set(new THREE.Vector3(x, far / 2, z), direction);
    const intersects = raycaster.intersectObject(new THREE.Mesh(geometry));

    if (intersects.length > 0) {
      const height = far / 2 - intersects[0].distance;
      if (x === 0 && z === 0) {
        console.log('Sample terrain height at (0,0):', height);
      }
      return height;
    }
    return 0;
  };

  const [ref] = useCompoundBody(() => {
    if (processedTerrain) {
      console.log('Creating physics body with', processedTerrain.shapes.length, 'shapes');
      return {
        mass: 0,
        shapes: processedTerrain.shapes,
        position: [0, 0, 0],
      };
    }
    return {};
  });

  if (!processedTerrain) {
    return null;
  }

  return (
    <group ref={ref}>
      <mesh geometry={processedTerrain.originalGeometry}>
        <meshStandardMaterial color="#4a9c2d" />
      </mesh>
    </group>
  );
};

export default TerrainModel;