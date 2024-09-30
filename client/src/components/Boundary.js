// File: components/Boundary.js
import React from 'react';
import { usePlane } from '@react-three/cannon';

const Boundary = ({ position, rotation }) => {
  const [ref] = usePlane(() => ({ position, rotation }));
  return <group ref={ref} />;
};

export default Boundary;
