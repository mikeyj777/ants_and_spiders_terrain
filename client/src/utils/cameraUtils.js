// File: utils/cameraUtils.js
import { Vector3 } from 'three';

const CAMERA_SPEED = 0.5;

export const updateCameraPosition = (camera, moveState) => {
  const cameraDirection = new Vector3();
  camera.getWorldDirection(cameraDirection);
  const cameraRight = new Vector3(cameraDirection.z, 0, -cameraDirection.x).normalize();

  if (moveState.moveForward) {
    camera.position.addScaledVector(cameraDirection, CAMERA_SPEED);
  }
  if (moveState.moveBackward) {
    camera.position.addScaledVector(cameraDirection, -CAMERA_SPEED);
  }
  if (moveState.moveLeft) {
    camera.position.addScaledVector(cameraRight, -CAMERA_SPEED);
  }
  if (moveState.moveRight) {
    camera.position.addScaledVector(cameraRight, CAMERA_SPEED);
  }
};