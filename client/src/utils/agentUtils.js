// File: utils/agentUtils.js
import { Vector3 } from 'three';
import { Spider, Ant } from '../components/AgentClasses';
import * as transform from './transform';
const NUM_SPIDERS = 1;
const NUM_ANTS = 0;

export const createInitialAgents = () => {
  const spiders = [];
  const ants = [];

  for (let i = 0; i < NUM_SPIDERS; i++) {
    
    const rawPosition = new Vector3(
      5,
      10,
      7
    );

    const agentPosition = transform.modelToAgentCoordinates(rawPosition);
    const modelPosition = transform.agentToModelCoordinates(agentPosition);
    // console.log("model position:", modelPosition.toArray(), " | agent position:", agentPosition.toArray(), " | raw position:", rawPosition.toArray());

    // const agentPosition = transformInstance.rawToAgent(rawPosition);
    // console.log("agent position:", agentPosition.toArray(), " | raw position:", rawPosition.toArray());
    spiders.push(new Spider(i, rawPosition));
  }

  for (let i = 0; i < NUM_ANTS; i++) {
    const position = new Vector3(
      (Math.random() - 0.5) * 10,
      10,
      (Math.random() - 0.5) * 10
    );
    ants.push(new Ant(i, position));
  }

  return { spiders, ants };
};

export const moveAgent = (currentPosition) => {
  let x = currentPosition.x;
  let z = currentPosition.z;

  z += 0;
  if (z > 100) {
    z = 0;
    x += 5;
  }
  if (x > 100) {
    x = 0;
    z = 0;
  }

  return new Vector3(x, currentPosition.y, z);
};