// src/hooks/usePowerUps.js

import { useState, useEffect, useRef, useCallback } from 'react';
import useGameSounds from './useGameSounds';

// Solo estos tres power-ups existen ahora.
const DURATIONS = {
  invulnerable: 5,
  piercing:     10,
  damage:       10,
};

function usePowerUps(
  isGameActive,
  planeRef,
  setIsImmune,
  setIsPowerUpImmune,
  setPiercing,
  setDamageBoost,
  setActivePowerUp,
  setPowerUpTimeLeft,
  cancelBlink,         // ← recibe cancelBlink de useLives para limpiar inmunidad al activar
  blinkTimerRef = { current: null },
) {
  const [powerUps, setPowerUps] = useState([]);

  const countdownRef = useRef(null);
  const lastTypeRef  = useRef(null);

  const { playPowerUp } = useGameSounds();

  const spawnPowerUp = useCallback((type = 'random') => {
    const types = ['invulnerable', 'piercing', 'damage'];
    let selected;
    if (type !== 'random') {
      selected = type;
    } else {
      let pool = types;
      if (lastTypeRef.current && pool.length > 1) {
        pool = pool.filter(t => t !== lastTypeRef.current);
      }
      selected = pool[Math.floor(Math.random() * pool.length)];
    }

    const x = Math.random() * 140 + 20;
    setPowerUps(prev => [
      ...prev,
      { x, y: -64, type: selected, id: Date.now() + Math.random() },
    ]);
  }, []);

  // Movimiento y recogida
  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      setPowerUps(prev => {
        const updated = [];
        const plane   = planeRef.current;
        if (!plane) return prev;

        const px = parseInt(plane.style.left || '100');
        const py = parseInt(plane.style.top  || '200');

        for (const p of prev) {
          const newY    = p.y + 1;
          const hitboxX = p.x + 12;
          const hitboxY = newY + 79;

          const hit =
            hitboxX      < px + 60 &&
            hitboxX + 40 > px      &&
            hitboxY      < py + 60 &&
            hitboxY + 40 > py;

          if (hit) {
            activatePowerUp(p.type);
            playPowerUp();
          } else if (newY < 600) {
            updated.push({ ...p, y: newY });
          }
        }
        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isGameActive]);

  const deactivateAll = useCallback(() => {
    setIsPowerUpImmune(false);
    setPiercing(false);
    setDamageBoost(false);
    setActivePowerUp(null);
    setPowerUpTimeLeft(0);
  }, []);

  const activatePowerUp = (type) => {
    // Limpiar countdown anterior
    clearInterval(countdownRef.current);
    countdownRef.current = null;
    deactivateAll();

    // FIX BUG INMUNIDAD: si el jugador estaba en medio de un blink de daño,
    // cancelBlink() restaura isImmuneRef a false antes de aplicar el nuevo
    // estado de power-up. Sin esto, el blink cancelado dejaba isImmuneRef
    // en true para siempre → jugador inmortal el resto de la partida.
    cancelBlink?.();

    lastTypeRef.current = type;

    const duration = DURATIONS[type] ?? 0;
    if (duration === 0) return;

    if (type === 'invulnerable') {
      setIsPowerUpImmune(true);
      setIsImmune(true);
    } else if (type === 'piercing') {
      setPiercing(true);
    } else if (type === 'damage') {
      setDamageBoost(true);
    }

    setActivePowerUp(type);
    setPowerUpTimeLeft(duration);

    let seconds = duration;
    countdownRef.current = setInterval(() => {
      seconds -= 1;
      setPowerUpTimeLeft(seconds);
      if (seconds <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        deactivateAll();
      }
    }, 1000);
  };

  return {
    powerUps,
    setPowerUps,
    spawnPowerUp,
  };
}

export default usePowerUps;