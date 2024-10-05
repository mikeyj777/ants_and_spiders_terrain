import React, { useState, useEffect, useRef } from 'react';

const HurricaneGameOfLifeVanilla = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [oceanTemperature, setOceanTemperature] = useState(28);
  const [pressureGradient, setPressureGradient] = useState(5);
  const [coriolisStrength, setCoriolisStrength] = useState(0.5);
  const [gameOfLifeInterval, setGameOfLifeInterval] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });

  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const hurricaneRadius = Math.min(canvas.width, canvas.height) / 2;

    let grid = [];
    const gridSize = 100;
    const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

    const initializeSimulation = () => {
      grid = [];
      for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
          const dx = (i - gridSize / 2) * cellSize;
          const dy = (j - gridSize / 2) * cellSize;
          const isInsideHurricane = Math.sqrt(dx * dx + dy * dy) < hurricaneRadius;
          grid[i][j] = {
            state: Math.random() < 0.1 ? 1 : 0,
            gridX: i,
            gridY: j,
            displayX: dx,
            displayY: dy,
            angle: isInsideHurricane ? Math.atan2(dy, dx) : 0,
            radius: isInsideHurricane ? Math.sqrt(dx * dx + dy * dy) : 0,
            age: 0,
          };
        }
      }
    };

    const countNeighbors = (grid, x, y) => {
      let sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let col = (x + i + gridSize) % gridSize;
          let row = (y + j + gridSize) % gridSize;
          sum += grid[col][row].state;
        }
      }
      sum -= grid[x][y].state;
      return sum;
    };

    const updateGameOfLife = () => {
      const nextGrid = [];
      for (let i = 0; i < gridSize; i++) {
        nextGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
          let cell = grid[i][j];
          let neighbors = countNeighbors(grid, cell.gridX, cell.gridY);

          if (cell.state === 0 && neighbors === 3) {
            nextGrid[i][j] = { ...cell, state: 1, age: 0 };
          } else if (cell.state === 1 && (neighbors < 2 || neighbors > 3)) {
            nextGrid[i][j] = { ...cell, state: 0, age: 0 };
          } else {
            nextGrid[i][j] = { ...cell, age: cell.state === 1 ? cell.age + 1 : 0 };
          }
        }
      }
      grid = nextGrid;
    };

    initializeSimulation();

    let gameOfLifeCounter = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 100, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let maxAge = 0;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cell = grid[i][j];
          if (cell.state === 1 && cell.age > maxAge) {
            maxAge = cell.age;
          }
        }
      }

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cell = grid[i][j];
          const isInsideHurricane = cell.radius > 0;

          if (isInsideHurricane) {
            const speed = (pressureGradient / 10) * (1 - cell.radius / hurricaneRadius);
            const rotationDirection = coriolisStrength > 0.5 ? 1 : -1;
            cell.angle += speed * rotationDirection * (coriolisStrength / 0.5) * 0.02;

            cell.displayX = Math.cos(cell.angle) * cell.radius;
            cell.displayY = Math.sin(cell.angle) * cell.radius;
          }

          if (cell.state === 1) {
            const hue = Math.floor((cell.age / maxAge) * 300);
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(cell.displayX + centerX, cell.displayY + centerY, cellSize, cellSize);
          }
        }
      }

      gameOfLifeCounter++;
      if (gameOfLifeCounter >= gameOfLifeInterval) {
        updateGameOfLife();
        gameOfLifeCounter = 0;
      }

      const eyeRadius = Math.max(5, 20 - pressureGradient * 2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, eyeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying, oceanTemperature, pressureGradient, coriolisStrength, gameOfLifeInterval]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const resetSimulation = () => {
    setOceanTemperature(28);
    setPressureGradient(5);
    setCoriolisStrength(0.5);
    setGameOfLifeInterval(50);
    setIsPlaying(false);
  };

  const showParameterDescription = (param) => {
    let title, description;
    switch (param) {
      case "oceanTemperature":
        title = "Ocean Temperature";
        description = "Controls the surface temperature of the ocean. Higher temperatures provide more energy to the hurricane, increasing its intensity.";
        break;
      case "pressureGradient":
        title = "Pressure Gradient";
        description = "Represents the difference in atmospheric pressure between the center of the storm and its surroundings. A higher gradient leads to stronger winds.";
        break;
      case "coriolisStrength":
        title = "Coriolis Strength";
        description = "Simulates the Coriolis effect, which causes the hurricane to rotate. Higher values lead to faster rotation.";
        break;
      case "gameOfLifeInterval":
        title = "Game of Life Interval";
        description = "Controls the speed of the Game of Life simulation. Lower values result in faster updates.";
        break;
    }
    setModalContent({ title, description });
    setShowModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '300px', backgroundColor: '#e6f7ff', borderRadius: '4px', marginBottom: '1rem' }} />

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={togglePlay} style={{ marginRight: '0.5rem' }}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={resetSimulation} style={{ marginRight: '0.5rem' }}>Reset</button>
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      </div>

      {showSettings && (
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Ocean Temperature: {oceanTemperature}°C</label>
            <input
              type="range"
              value={oceanTemperature}
              onChange={(e) => setOceanTemperature(Number(e.target.value))}
              min={0}
              max={40}
              style={{ width: '100%' }}
            />
            <button onClick={() => showParameterDescription("oceanTemperature")}>?</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Pressure Gradient: {pressureGradient.toFixed(1)}</label>
            <input
              type="range"
              value={pressureGradient}
              onChange={(e) => setPressureGradient(Number(e.target.value))}
              min={0}
              max={10}
              step={0.1}
              style={{ width: '100%' }}
            />
            <button onClick={() => showParameterDescription("pressureGradient")}>?</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Coriolis Strength: {coriolisStrength.toFixed(2)}</label>
            <input
              type="range"
              value={coriolisStrength}
              onChange={(e) => setCoriolisStrength(Number(e.target.value))}
              min={0}
              max={1}
              step={0.01}
              style={{ width: '100%' }}
            />
            <button onClick={() => showParameterDescription("coriolisStrength")}>?</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Game of Life Interval: {gameOfLifeInterval}</label>
            <input
              type="range"
              value={gameOfLifeInterval}
              onChange={(e) => setGameOfLifeInterval(Number(e.target.value))}
              min={1}
              max={100}
              style={{ width: '100%' }}
            />
            <button onClick={() => showParameterDescription("gameOfLifeInterval")}>?</button>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', maxWidth: '80%' }}>
            <h2>{modalContent.title}</h2>
            <p>{modalContent.description}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HurricaneGameOfLifeVanilla;