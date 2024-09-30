// File: utils/agentUtils.js
import { Vector3 } from 'three';
import { Spider, Ant } from '../components/AgentClasses';

const NUM_SPIDERS = 0;
const NUM_ANTS = 0;

export const createInitialAgents = () => {
  const spiders = [];
  const ants = [];

  for (let i = 0; i < NUM_SPIDERS; i++) {
    const position = new Vector3(
      (Math.random() - 0.5) * 10,
      10,
      (Math.random() - 0.5) * 10
    );
    spiders.push(new Spider(i, position));
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