// File: components/AgentSphere.js
import React, { useEffect } from 'react';
import { useSphere } from '@react-three/cannon';

const AgentSphere = ({ agent }) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: agent.position.toArray(),
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      agent.position.set(position[0], position[1], position[2]);
    });
    return unsubscribe;
  }, [api, agent]);

  // console.log("agent id:", agent.id, " | position:", agent.position.toArray());

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color={agent.color} />
    </mesh>
  );
};

export default AgentSphere;