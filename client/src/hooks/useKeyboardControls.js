import { useState, useEffect, useCallback } from 'react';

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    arrowDown: false,
    t: false,
    c: false,
  });

  const handleKeyDown = useCallback((event) => {
    switch (event.code) {
      case 'ArrowLeft':
        setKeys((keys) => ({ ...keys, arrowLeft: true }));
        break;
      case 'ArrowRight':
        setKeys((keys) => ({ ...keys, arrowRight: true }));
        break;
      case 'ArrowUp':
        setKeys((keys) => ({ ...keys, arrowUp: true }));
        break;
      case 'ArrowDown':
        setKeys((keys) => ({ ...keys, arrowDown: true }));
        break;
      case 'KeyT':
        setKeys((keys) => ({ ...keys, t: true }));
        break;
      case 'KeyC':
        setKeys((keys) => ({ ...keys, c: true }));
        break;
      case 'KeyG':
        setKeys((keys) => ({ ...keys, g: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.code) {
      case 'ArrowLeft':
        setKeys((keys) => ({ ...keys, arrowLeft: false }));
        break;
      case 'ArrowRight':
        setKeys((keys) => ({ ...keys, arrowRight: false }));
        break;
      case 'ArrowUp':
        setKeys((keys) => ({ ...keys, arrowUp: false }));
        break;
      case 'ArrowDown':
        setKeys((keys) => ({ ...keys, arrowDown: false }));
        break;
      case 'KeyT':
        setKeys((keys) => ({ ...keys, t: false }));
        break;
      case 'KeyC':
        setKeys((keys) => ({ ...keys, c: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
};