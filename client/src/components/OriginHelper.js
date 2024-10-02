import React from 'react';
import * as THREE from 'three';

const OriginHelper = ({ size = 100 }) => {
  return (
    <group>
      {/* Sphere at origin */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* X-axis (red) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={2}
            array={new Float32Array([0, 0, 0, size, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="red" />
      </line>

      {/* Y-axis (green) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={2}
            array={new Float32Array([0, 0, 0, 0, size, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="green" />
      </line>

      {/* Z-axis (blue) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0, size])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="blue" />
      </line>
    </group>
  );
};

export default OriginHelper;