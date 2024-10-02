import { Vector3, Matrix4 } from 'three';

// Constants from your Scene setup
const BOX_ROTATION_DEGREES = 35;
const BOX_SIZE = 45;
const ANCHOR_POINT = new Vector3(-7, -5, -30);

// Create transformation matrices
const rotationMatrix = new Matrix4().makeRotationY(BOX_ROTATION_DEGREES * Math.PI / 180);
const inverseRotationMatrix = new Matrix4().makeRotationY(-BOX_ROTATION_DEGREES * Math.PI / 180);

// Function to transform agent coordinates to model coordinates
export function agentToModelCoordinates(agentPosition) {
  // Scale agent coordinates to match box size
  const scaledX = (agentPosition.x / 100) * BOX_SIZE;
  const scaledZ = (agentPosition.z / 100) * BOX_SIZE;

  // Create a vector for the scaled coordinates
  const vect = new Vector3(scaledX, agentPosition.y, scaledZ);

  // Apply rotation
  vect.applyMatrix4(rotationMatrix);

  // Translate to model space
  vect.add(ANCHOR_POINT);

  console.log("agent position:", agentPosition.toArray(), " | model position:", vect.toArray());

  return vect;
}

// Function to transform model coordinates to agent coordinates
export function modelToAgentCoordinates(modelPosition) {
  // Create a vector for the model coordinates
  let vect = new Vector3(modelPosition.x, modelPosition.y, modelPosition.z);

  // Translate back to origin
  vect.sub(ANCHOR_POINT);

  // Apply inverse rotation
  vect.applyMatrix4(inverseRotationMatrix);

  // Scale back to agent coordinates
  vect.x = (vect.x / BOX_SIZE) * 100;
  vect.z = (vect.z / BOX_SIZE) * 100;

  return vect;
}

// Helper function to check if a point is within the bounding box
export function isWithinBoundingBox(modelX, modelZ) {
  const agentCoords = modelToAgentCoordinates(modelX, modelZ);
  return agentCoords.x >= 0 && agentCoords.x <= 100 && 
         agentCoords.z >= 0 && agentCoords.z <= 100;
}