// src/components/Game.jsx
import { useRef, useState, useEffect } from 'react';
import usePlaneControls from '../hooks/player/usePlaneControls';
import useBullets from '../hooks/player/useBullets';
import useClouds from '../hooks/useClouds';
import usePlayerCollision from '../hooks/player/usePlayerCollision';
import useEnemiesCollisions from '../hooks/enemies/useEnemiesCollisions';
import Background from './Background'; // al principio
import Plane from './Player';
import Bullets from './Bullets';
import Clouds from './Clouds';
import '../styles/base.css';

import useEnemies from '../hooks/enemies/useEnemies';
import Enemies from './enemies/Enemies';

function Game() {
  const planeRef = useRef(null);
  const propellerRef = useRef(null);
  const [isAngry, setIsAngry] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal');
  const [showHitboxes, setShowHitboxes] = useState(false);
  
  const [isPaused, setIsPaused] = useState(false);
  const isGameActive = !isPaused;

  const {
    keys,
    planeImage,
    propellerFrame
  } = usePlaneControls(planeRef, viewMode);

  const [clouds] = useClouds(isGameActive);
  const [bullets, setBullets] = useBullets(keys, planeRef, viewMode, isGameActive);
  const [enemies, setEnemies, spawnEnemies, enemyPropellerFrame] = useEnemies(isGameActive);

  usePlayerCollision(clouds, planeRef, !isGameActive);
  useEnemiesCollisions(bullets, enemies, setBullets, setEnemies, isGameActive);

  const toggleView = () => {
    setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'q') toggleView();
      if (e.key === 'f') setIsAngry(prev => !prev);
      if (e.key === 'Tab') {
      e.preventDefault(); // evita cambiar de foco
      setShowHitboxes(prev => !prev);
    }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

   // ejemplo de generación manual
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      spawnEnemies('basic', 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="game-wrapper"
      style={{
        width: '800px',
        height: '500px',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Background isGameActive={isGameActive} />
      <Plane
        viewMode={viewMode}
        planeRef={planeRef}
        propellerRef={propellerRef}
        propellerFrame={propellerFrame}
        isAngry={isAngry}
        planeImage={planeImage}
        showHitboxes={showHitboxes}
      />
      <Clouds clouds={clouds} />
      <Enemies enemies={enemies} enemyPropellerFrame={enemyPropellerFrame} showHitboxes={showHitboxes}/>
      <Bullets bullets={bullets} />
    </div>
  );
}

export default Game;
