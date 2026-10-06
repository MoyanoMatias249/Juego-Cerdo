// src/components/Game.jsx

import { useRef, useState, useEffect, useCallback } from 'react';
import usePlaneControls        from '../hooks/player/usePlaneControls';
import useBullets              from '../hooks/player/useBullets';
import usePlayerCollision      from '../hooks/player/usePlayerCollision';
import useEnemiesCollisions    from '../hooks/enemies/useEnemiesCollisions';
import Background              from './Background';
import Plane                   from './Player';
import Bullets                 from './Bullets';
import useLives                from '../hooks/player/useLives';
import LivesDisplay            from './ui/LivesDisplay';
import GameOverScreen          from './ui/GameOverScreen';
import PauseMenu               from './ui/PauseMenu';
import useClouds               from '../hooks/useClouds';
import Clouds                  from './Clouds';
import PowerUps                from './PowerUps';
import usePowerUps             from '../hooks/usePowerUps';
import '../styles/base.css';
import useEnemies              from '../hooks/enemies/useEnemies';
import Enemies                 from './enemies/Enemies';
import PirateFlag              from './ui/PirateFlag';
import useEnemyBullets         from '../hooks/enemies/useEnemyBullets';
import EnemyBullets            from './enemies/EnemyBullets';
import GameStats               from './ui/GameStats';
import useMuzzleFlashAnimation from '../hooks/player/useMuzzleFlashAnimation';
import useGameSounds           from '../hooks/useGameSounds';
import MobileControls          from './ui/MobileControls';
import useGameManager          from '../hooks/useGameManager';
import PowerUpState            from './ui/PowerUpState';
import useDeathAnimations      from '../hooks/useDeathAnimations';
import DeathAnimations         from './enemies/DeathAnimations';
import { buildPlaneFilter }    from './ui/PlaneColorPicker';

function Game({ difficulty = 'normal', planeHue = 0, onMenu }) {
  const planeRef     = useRef(null);
  const propellerRef = useRef(null);

  const [viewMode,       setViewMode]       = useState('horizontal');
  const [showHitboxes,   setShowHitboxes]   = useState(false);
  const [showGameOver,   setShowGameOver]   = useState(false);
  const [isPaused,       setIsPaused]       = useState(false);
  const [isPauseMenu,    setIsPauseMenu]    = useState(false);
  const [timeElapsed,    setTimeElapsed]    = useState(0);
  const [score,          setScore]          = useState(0);
  const [isGameOver,     setIsGameOver]     = useState(false);
  const [isStart,        setIsStart]        = useState(true);
  const [resetCount,     setResetCount]     = useState(0);
  const [isMobile,       setIsMobile]       = useState(false);
  const [bossDeathCount, setBossDeathCount] = useState(0);

  const isGameActive = !isPaused && !isGameOver;

  const [clouds, setClouds, isPausedRef] = useClouds();

  const isControlBlocked = isPaused || isGameOver;
  const { keys, planeImage, propellerFrame } = usePlaneControls(planeRef, viewMode, isControlBlocked);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setTimeout(() => {
      setIsPaused(true);
      setShowGameOver(true);
    }, 1000);
  }, []);

  const livesForDiff = { easy: 10, normal: 6, hard: 2 }[difficulty] ?? 6;

  const {
    lives, isImmune, isImmuneRef, blinkTimerRef,
    setIsImmune, blink, triggerDamage, setLives, cancelBlink,
  } = useLives(handleGameOver, planeRef, difficulty);

  const [isPowerUpImmune, setIsPowerUpImmune] = useState(false);
  const [damageBoost,     setDamageBoost]     = useState(false);
  const [piercing,        setPiercing]        = useState(false);
  const [activePowerUp,   setActivePowerUp]   = useState(null);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);

  const { powerUps, setPowerUps, spawnPowerUp } = usePowerUps(
    isGameActive,
    planeRef,
    setIsImmune,
    setIsPowerUpImmune,
    setPiercing,
    setDamageBoost,
    setActivePowerUp,
    setPowerUpTimeLeft,
    cancelBlink,    // ← fix del bug de inmunidad permanente
    blinkTimerRef,
  );

  const { playPigStart, playEnemyDeath } = useGameSounds();
  const { deathAnims, triggerDeathAnim, clearDeathAnims } = useDeathAnimations();

  const [muzzleSprite, triggerMuzzleFlash] = useMuzzleFlashAnimation(viewMode);
  const [bullets,      setBullets]   = useBullets(keys, planeRef, viewMode, isGameActive, triggerMuzzleFlash, piercing, damageBoost);
  const [enemies,      setEnemies, spawnEnemies, enemyPropellerFrame] = useEnemies(isGameActive, planeRef);
  const [enemyBullets, setEnemyBullets] = useEnemyBullets(enemies, isGameActive);

  useEffect(() => {
    if (!isStart) return;
    playPigStart();
    const t = setTimeout(() => { playPigStart(); setIsStart(false); }, 1000);
    return () => clearTimeout(t);
  }, [isStart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isGameOver) setIsPaused(true);
  }, [isGameOver]);

  usePlayerCollision(enemies, enemyBullets, planeRef, isGameActive, triggerDamage, isImmuneRef);

  useEnemiesCollisions(
    bullets, enemies, setBullets, setEnemies,
    isGameActive, setScore, triggerDeathAnim, playEnemyDeath,
  );

  useEffect(() => { isPausedRef.current = !isGameActive; }, [isGameActive]);

  const toggleView = () => setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');

  const openPauseMenu = useCallback(() => {
    if (isGameOver || showGameOver) return;
    setIsPaused(true);
    setIsPauseMenu(true);
  }, [isGameOver, showGameOver]);

  const closePauseMenu = useCallback(() => {
    setIsPaused(false);
    setIsPauseMenu(false);
  }, []);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setLives(livesForDiff);
    setEnemies([]);
    setBullets([]);
    setEnemyBullets([]);
    setClouds([]);
    setViewMode('horizontal');
    setIsPaused(false);
    setIsPauseMenu(false);
    setShowGameOver(false);
    setTimeElapsed(0);
    setScore(0);
    setPowerUps([]);
    setResetCount(p => p + 1);
    setBossDeathCount(0);
    setIsStart(true);
    clearDeathAnims();
    if (planeRef.current) {
      planeRef.current.style.left = '100px';
      planeRef.current.style.top  = '200px';
    }
  }, [livesForDiff]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (isGameOver || showGameOver) return;
        isPauseMenu ? closePauseMenu() : openPauseMenu();
        return;
      }
      if (isGameOver || !isGameActive) return;
      if (e.key === 'q') toggleView();
      if (e.key === 'Tab') { e.preventDefault(); setShowHitboxes(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGameOver, isGameActive, isPauseMenu, showGameOver, openPauseMenu, closePauseMenu]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const handleMobileAction = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: key, bubbles: true }));
  };

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible' && !isPauseMenu && !isGameOver) {
        openPauseMenu();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [isPauseMenu, isGameOver, openPauseMenu]);

  useGameManager({
    isGameActive, isGameOver, enemies, setEnemies,
    spawnEnemy:  (type) => spawnEnemies(type, 1),
    spawnPowerUp, powerUps, resetCount, setTimeElapsed, timeElapsed,
    onBossDeath: () => setBossDeathCount(p => p + 1),
  });

  useEffect(() => {
    if (!isGameActive || isGameOver) return;
    const interval = setInterval(() => setTimeElapsed(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isGameActive, isGameOver]);

  const planeColorFilter = buildPlaneFilter(planeHue);

  return (
    <div
      className="game-wrapper"
      style={{ width: '800px', height: '500px', backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}
    >
      {isMobile && !isGameOver && !isPauseMenu && (
        <MobileControls onAction={handleMobileAction} />
      )}

      {!isGameOver && !showGameOver && (
        <button
          onClick={isPauseMenu ? closePauseMenu : openPauseMenu}
          style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: 7000,
            width: '36px', height: '36px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 0,
          }}
          title="Pausa (Esc / P)"
        >
          {isPauseMenu
            ? <svg width="14" height="14" viewBox="0 0 12 12" fill="white"><polygon points="2,1 11,6 2,11"/></svg>
            : <svg width="14" height="14" viewBox="0 0 12 12" fill="white"><rect x="2" y="1" width="3" height="10"/><rect x="7" y="1" width="3" height="10"/></svg>
          }
        </button>
      )}

      {isPauseMenu && !showGameOver && (
        <PauseMenu onResume={closePauseMenu} onRestart={resetGame} onMenu={onMenu} />
      )}
      {showGameOver && (
        <GameOverScreen score={score} timeElapsed={timeElapsed} onRetry={resetGame} onMenu={onMenu} />
      )}

      <Clouds clouds={clouds} />
      <Background isGameActive={isGameActive} />

      <LivesDisplay lives={lives} difficulty={difficulty} />
      <GameStats timeElapsed={timeElapsed} score={score} />
      <PowerUpState activePowerUp={activePowerUp} powerUpTimeLeft={powerUpTimeLeft} />

      <Plane
        viewMode={viewMode}
        planeRef={planeRef}
        propellerRef={propellerRef}
        propellerFrame={propellerFrame}
        planeImage={planeImage}
        showHitboxes={showHitboxes}
        blink={blink}
        immune={isImmune}
        isPowerUpImmune={isPowerUpImmune}
        muzzleSprite={muzzleSprite}
        difficulty={difficulty}
        planeColorFilter={planeColorFilter}
      />

      {!isGameOver && <Bullets bullets={bullets} />}

      <PirateFlag isGameActive={isGameActive} resetTrigger={resetCount} />
      <Enemies enemies={enemies} enemyPropellerFrame={enemyPropellerFrame} showHitboxes={showHitboxes} />
      {!isGameOver && <EnemyBullets bullets={enemyBullets} showHitboxes={showHitboxes} />}
      <PowerUps powerUps={powerUps} showHitboxes={showHitboxes} />
      <DeathAnimations deathAnims={deathAnims} />
    </div>
  );
}

export default Game;