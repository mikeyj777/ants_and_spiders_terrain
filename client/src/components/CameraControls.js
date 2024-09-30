import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls = () => {
  const { camera, gl } = useThree();
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const buttonPressedRef = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    
    const onMouseDown = (event) => {
      isDraggingRef.current = true;
      buttonPressedRef.current = event.button;
      prevMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseMove = (event) => {
      if (!isDraggingRef.current) return;

      const deltaX = event.clientX - prevMouseRef.current.x;
      const deltaY = event.clientY - prevMouseRef.current.y;

      if (buttonPressedRef.current === 0) { // Left click
        // Orbit
        const rotationSpeed = 0.01;
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed * deltaX);
        camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), -rotationSpeed * deltaY);
        camera.lookAt(0, 0, 0);
      } else if (buttonPressedRef.current === 2) { // Right click
        // Pan
        const panSpeed = 0.05;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);
        camera.getWorldDirection(right).cross(up).normalize();
        camera.position.addScaledVector(right, -deltaX * panSpeed);
        camera.position.addScaledVector(up, deltaY * panSpeed);
      }

      prevMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const onWheel = (event) => {
      // Zoom
      const zoomSpeed = 0.001;
      const zoomDelta = event.deltaY * zoomSpeed;
      camera.position.addScaledVector(camera.position, zoomDelta);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl]);

  useFrame(() => {
    // You can add any per-frame updates here if needed
  });

  return null;
};

export default CameraControls;