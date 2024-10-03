import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

extend( { OrbitControls } );

const CameraControls = () => {
  const { camera, gl, scene } = useThree();
  const controls = useRef();
  const keys = useKeyboardControls();
  const [isTopView, setIsTopView] = useState(false);
  const normalPosition = useRef(new THREE.Vector3(0, -20, 10));
  const topPosition = useRef(new THREE.Vector3(0, 0, 50));
  const goodPosition = useRef(new THREE.Vector3(-15, 30, 9));

  useEffect(() => {
    const currentControls = controls.current;
    if (currentControls) {
      currentControls.enableDamping = true;
      currentControls.dampingFactor = 0.25;
      currentControls.enableZoom = true;
      currentControls.zoomSpeed = 0.5;
      currentControls.enablePan = true;
      currentControls.panSpeed = 0.5;
      currentControls.rotateSpeed = 0.5;
      currentControls.target.set(0, 0, 0);
      currentControls.update();
    }
    return () => currentControls?.dispose();
  }, []);

  useFrame(() => {
    if (controls.current) {
      controls.current.update();

      // Handle arrow key rotations
      if (keys.arrowLeft) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.02);
      }
      if (keys.arrowRight) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.02);
      }
      if (keys.arrowUp) {
        const axis = new THREE.Vector3().crossVectors(camera.position, new THREE.Vector3(0, 0, 1)).normalize();
        camera.position.applyAxisAngle(axis, 0.02);
      }
      if (keys.arrowDown) {
        const axis = new THREE.Vector3().crossVectors(camera.position, new THREE.Vector3(0, 0, 1)).normalize();
        camera.position.applyAxisAngle(axis, -0.02);
      }

      // Ensure camera is always looking at the center
      camera.lookAt(0, 0, 0);

      // Toggle top view
      if (keys.t) {
        setIsTopView((prev) => !prev);
        if (!isTopView) {
          normalPosition.current.copy(camera.position);
          camera.position.copy(topPosition.current);
        } else {
          camera.position.copy(normalPosition.current);
        }
        controls.current.target.set(0, 0, 0);
        keys.t = false; // Reset the key state
      }

      // Center view
      if (keys.c) {
        camera.position.copy(normalPosition.current);
        controls.current.target.set(0, 0, 0);
        keys.c = false; // Reset the key state
      }

      if (keys.g) {
        console.log("good position:", goodPosition.current.toArray());
        camera.position.copy(goodPosition.current);
        controls.current.target.set(0, 0, 0);
        keys.g = false; // Reset the key state
      }

    }
  });

  return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
};

export default CameraControls;