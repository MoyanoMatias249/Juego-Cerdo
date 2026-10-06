// src/hooks/player/useBullets.js
import { useEffect, useState, useRef } from 'react';
import useGameSounds from '../useGameSounds';
import bulletSprite from '../../assets/sprites-player/bullet.png';

let bulletIdCounter = 0;
const nextBulletId = () => `b-${++bulletIdCounter}`;

function useBullets(keys = {}, planeRef, viewMode, isGameActive, triggerMuzzleFlash, piercing = false, damageBoost = false) {
  const [bullets, setBullets] = useState([]);
  const [isHolding, setIsHolding] = useState(false);
  const { playShoot } = useGameSounds();

  // Refs para evitar stale closures dentro del interval de disparo continuo
  const viewModeRef   = useRef(viewMode);
  const piercingRef   = useRef(piercing);
  const damageBoostRef = useRef(damageBoost);

  useEffect(() => { viewModeRef.current   = viewMode;    }, [viewMode]);
  useEffect(() => { piercingRef.current   = piercing;    }, [piercing]);
  useEffect(() => { damageBoostRef.current = damageBoost; }, [damageBoost]);

  // Detectar pulsación inicial de Space
  useEffect(() => {
    const spacePressed = keys.Space ?? false;
    if (spacePressed && !isHolding) {
      setIsHolding(true);
      shootBullet();
    } else if (!spacePressed && isHolding) {
      setIsHolding(false);
    }
  }, [keys.Space, isHolding]);

  // Disparo continuo mientras se mantiene Space
  useEffect(() => {
    if (!isHolding || !isGameActive) return;
    const intervalMs = piercingRef.current ? 100 : 150;
    const interval = setInterval(() => {
      shootBullet();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isHolding, isGameActive, piercing]); // piercing cambia el intervalo, por eso va aquí

  // Cancelar disparo si el juego se pausa/termina
  useEffect(() => {
    if (!isGameActive) setIsHolding(false);
  }, [isGameActive]);

  // Movimiento de balas — también via rAF para sincronizar con colisiones
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameActive) return;
      setBullets(prev =>
        prev
          .map(b => ({
            ...b,
            x: b.direction === 'right' ? b.x + 10 : b.x,
            y: b.direction === 'down'  ? b.y + 10 : b.y,
          }))
          .filter(b =>
            (b.direction === 'right' && b.x < 820) ||
            (b.direction === 'down'  && b.y < 520)
          )
      );
    }, 16);
    return () => clearInterval(interval);
  }, [isGameActive]);

  const shootBullet = () => {
    const plane = planeRef.current;
    if (!plane) return;

    const left   = parseInt(plane.style.left || '100');
    const top    = parseInt(plane.style.top  || '200');
    const vm     = viewModeRef.current;
    const pc     = piercingRef.current;
    const db     = damageBoostRef.current;
    const damage = db ? 1.25 : 1;

    const bulletsToShoot = vm === 'horizontal'
      ? [
          { x: left + 104, y: top + 65, direction: 'right' },
          { x: left + 104, y: top + 75, direction: 'right' },
        ]
      : [
          { x: left + 41, y: top + 102, direction: 'down' },
          { x: left + 51, y: top + 102, direction: 'down' },
        ];

    if (db) {
      if (vm === 'horizontal') {
        bulletsToShoot.push(
          { x: left + 106, y: top + 55, direction: 'right' },
          { x: left + 106, y: top + 85, direction: 'right' }
        );
      } else {
        bulletsToShoot.push(
          { x: left + 31, y: top + 104, direction: 'down' },
          { x: left + 61, y: top + 104, direction: 'down' }
        );
      }
    }

    const formatted = bulletsToShoot.map(b => ({
      ...b,
      id: nextBulletId(),   // ← ID único, elimina el bug de key={index}
      sprite: bulletSprite,
      damage,
      piercing: pc,
      hitEnemies: new Set(),
    }));

    triggerMuzzleFlash();
    playShoot();
    setBullets(prev => [...prev, ...formatted]);
  };

  return [bullets, setBullets];
}

export default useBullets;  