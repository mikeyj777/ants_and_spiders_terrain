// File: hooks/useKeyboardControls.js
import { useState, useEffect } from 'react';

export const useKeyboardControls = () => {
  const [moveState, setMoveState] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      updateMoveState(event.code, true);
    };

    const handleKeyUp = (event) => {
      updateMoveState(event.code, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateMoveState = (code, isKeyDown) => {
    switch (code) {
      case 'ArrowUp':
        setMoveState((prev) => ({ ...prev, moveForward: isKeyDown }));
        break;
      case 'ArrowDown':
        setMoveState((prev) => ({ ...prev, moveBackward: isKeyDown }));
        break;
      case 'ArrowLeft':
        setMoveState((prev) => ({ ...prev, moveLeft: isKeyDown }));
        break;
      case 'ArrowRight':
        setMoveState((prev) => ({ ...prev, moveRight: isKeyDown }));
        break;
    }
  };

  return [moveState, setMoveState];
};
