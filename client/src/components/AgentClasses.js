import { Vector3 } from 'three';
import {v4 as uuidv4} from 'uuid';

export class Agent {
  constructor(id, position) {
    this.id = uuidv4();
    this.color = `hsl(${(id / 50) * 360}, 100%, 50%)`;
    this.position = position;
  }

  move() {
    const direction = new Vector3(
      Math.random() - 0.5, 
      0,
      Math.random() - 0.5
    ).normalize();
    
    this.position.add(direction.multiplyScalar(0.1));
  }
}

export class Spider extends Agent {
  constructor(id, position) {
    super(id, position);
    this.huntRadius = 5;
  }
  
  hunt(ants) {
    ants.forEach(ant => {
      if (ant.position.distanceTo(this.position) < this.huntRadius) {
        console.log(`Spider ${this.id} caught ant ${ant.id}!`);
        // TODO: Remove the caught ant
      }
    });
  }
}

export class Ant extends Agent {
  constructor(id, position) {  
    super(id, position);
  }

  leavePheromone(pheromones) {
    pheromones.push(this.position.clone());
  }
  
  followPheromone(pheromones) {
    const closePheromones = pheromones.filter(pheromone => 
      pheromone.distanceTo(this.position) < 2
    );
    
    if (closePheromones.length > 0) {
      const targetPheromone = closePheromones[0];
      const direction = targetPheromone.clone().sub(this.position).normalize();
      this.position.add(direction.multiplyScalar(0.05));
    }
  }
}