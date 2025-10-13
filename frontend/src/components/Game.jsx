// src/components/Game.jsx
import { useRef, useState, useEffect } from 'react';
import usePlaneControls from '../hooks/player/usePlaneControls';
import useBullets from '../hooks/player/useBullets';
import usePlayerCollision from '../hooks/player/usePlayerCollision';
import useEnemiesCollisions from '../hooks/enemies/useEnemiesCollisions';
import Background from './Background'; // al principio
import Plane from './Player';
import Bullets from './Bullets';
import useLives from '../hooks/player/useLives';
import LivesDisplay from './ui/LivesDisplay';
import GameOverScreen from './ui/GameOverScreen';

import useClouds from '../hooks/useClouds';
import Clouds from './Clouds';

import '../styles/base.css';

import useEnemies from '../hooks/enemies/useEnemies';
import Enemies from './enemies/Enemies';
import PirateFlag from './ui/PirateFlag';

import useEnemyBullets from '../hooks/enemies/useEnemyBullets';
import EnemyBullets from './enemies/EnemyBullets';

import GameStats from './ui/GameStats';
import useMuzzleFlashAnimation from '../hooks/player/useMuzzleFlashAnimation';

function Game() {
  const planeRef = useRef(null);
  const propellerRef = useRef(null);
  const [isAngry, setIsAngry] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal');
  const [showHitboxes, setShowHitboxes] = useState(false);
  const [useAltSkin, setUseAltSkin] = useState(false);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  
  const [isPaused, setIsPaused] = useState(false);
  const isGameActive = !isPaused;
  const [isGameOver, setIsGameOver] = useState(false);
  const [clouds, setClouds, isPausedRef] = useClouds()
  
  const [resetCount, setResetCount] = useState(0);
  const [canSpawnEnemies, setCanSpawnEnemies] = useState(false);;

  const {
    keys,
    planeImage,
    propellerFrame
  } = usePlaneControls(planeRef, viewMode, isGameOver, useAltSkin);
  
  const [muzzleSprite, triggerMuzzleFlash] = useMuzzleFlashAnimation(viewMode);

  const [bullets, setBullets] = useBullets(keys, planeRef, viewMode, isGameActive, triggerMuzzleFlash);
  const [enemies, setEnemies, spawnEnemies, enemyPropellerFrame] = useEnemies(isGameActive, planeRef);
  const [enemyBullets, setEnemyBullets] = useEnemyBullets(enemies);

  const { lives, isImmune, blink, triggerDamage, setLives } = useLives(() => {
    // Separar el cambio de estado del reinicio
    setIsGameOver(true);

    // Esperar al próximo ciclo de render antes de reiniciar
    setTimeout(() => {
      requestAnimationFrame(() => {
        resetGame();
      });
    }, 3000);
  }, planeRef);

  usePlayerCollision(enemies, enemyBullets, planeRef, isGameActive, triggerDamage);
  useEnemiesCollisions(bullets, enemies, setBullets, setEnemies, isGameActive, setScore);

  useEffect(() => {
    isPausedRef.current = !isGameActive;
  }, [isGameActive]);

  const toggleView = () => {
    setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  useEffect(() => {
    if (isGameOver || !isGameActive) return;
    const handleKey = (e) => {
      if (e.key === 'q') toggleView();
      if (e.key === 'f') setIsAngry(prev => !prev);
      if (e.key === 'e') setUseAltSkin(prev => !prev);
      if (e.key === 'Tab') {
      e.preventDefault(); // evita cambiar de foco
      setShowHitboxes(prev => !prev);
    }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGameOver, isGameActive]);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!isGameActive || isGameOver) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isGameOver]);


  useEffect(() => {
    // Solo se ejecuta una vez al iniciar el juego
    const timeout = setTimeout(() => {
      setCanSpawnEnemies(true);
    }, 2000); // mismo delay que en resetGame

    return () => clearTimeout(timeout);
  }, []);

    
  useEffect(() => {
    if (!canSpawnEnemies || isPaused) return;

    const interval = setInterval(() => {
      spawnEnemies('wolf', 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [canSpawnEnemies, isPaused]);

  useEffect(() => {
    if (!canSpawnEnemies || isPaused) return;

    const interval = setInterval(() => {
      spawnEnemies('shark', 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [canSpawnEnemies, isPaused]);


  useEffect(() => {
    if (!canSpawnEnemies || isPaused) return;
    
    const interval = setInterval(() => {
      spawnEnemies('boat-wolf', 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [canSpawnEnemies, isPaused]);


  const resetGame = () => {
    setIsGameOver(false);
    setLives(6);
    setEnemies([]);
    setBullets([]);
    setEnemyBullets([]);
    setClouds([]);
    setViewMode('horizontal');
    setIsPaused(false);
    setTimeElapsed(0);
    setScore(0);
    setResetCount(prev => prev + 1); // trigger para bandera
    setCanSpawnEnemies(false); // bloquear spawn

    setTimeout(() => {
      setCanSpawnEnemies(true); // habilitar spawn tras 2 segundos
    }, 2000);

    if (planeRef.current) {
      planeRef.current.style.left = '100px';
      planeRef.current.style.top = '200px';
    }
  };

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
      {isGameOver && <GameOverScreen />}
      
      <Clouds clouds={clouds} />
      <Background isGameActive={isGameActive} />
      <LivesDisplay lives={lives} />
      <GameStats timeElapsed={timeElapsed} score={score} />
      <Plane
        viewMode={viewMode}
        planeRef={planeRef}
        propellerRef={propellerRef}
        propellerFrame={propellerFrame}
        isAngry={isAngry}
        planeImage={planeImage}
        showHitboxes={showHitboxes}
        blink={blink}
        immune={isImmune}
        muzzleSprite={muzzleSprite}
      />
      {!isGameOver && <Bullets bullets={bullets} /> }

      <PirateFlag isGameActive={isGameActive} resetTrigger={resetCount} />
      <Enemies enemies={enemies} enemyPropellerFrame={enemyPropellerFrame} showHitboxes={showHitboxes}/>
      {!isGameOver && <EnemyBullets bullets={enemyBullets} showHitboxes={showHitboxes} />}

    </div>
  );
}

export default Game;
