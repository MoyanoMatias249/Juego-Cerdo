// src/hooks/useGameManager.js
import { useEffect, useRef } from 'react';

function useGameManager({
  isGameActive, isGameOver, enemies,
  spawnEnemy, spawnPowerUp, powerUps,
  resetCount, timeElapsed,
  onBossDeath = () => {}, // ← callback para sincronizar bossDeathCount en Game.jsx
}) {
  const lastSpawnTimes     = useRef({});
  const lastPowerUpTime    = useRef(0);
  const bossSpawned        = useRef(false);
  const bossExists         = useRef(false);
  const bossDeathCount     = useRef(0);
  const bossEntryTime      = useRef(null);
  const lastBossDeathTime  = useRef(null);
  const nextBossDelay      = useRef(40);
  const bulletWolfUnlocked = useRef(false);
  const bossTimeAlive      = useRef(0);

  useEffect(() => {
    lastSpawnTimes.current     = {};
    lastPowerUpTime.current    = 0;
    bossSpawned.current        = false;
    bossExists.current         = false;
    bossDeathCount.current     = 0;
    bossEntryTime.current      = null;
    lastBossDeathTime.current  = null;
    nextBossDelay.current      = 40;
    bulletWolfUnlocked.current = false;
    bossTimeAlive.current      = 0;
  }, [resetCount]);

  useEffect(() => {
    if (!isGameActive || isGameOver) return;

    const now         = timeElapsed;
    const bossIsAlive = enemies.some(e => e.type === 'ship-wolf' || e.type === 'air-ship');

    // ── Tracking del boss ──────────────────────────────────────────────────

    if (bossIsAlive && !bossExists.current) {
      bossExists.current    = true;
      bossEntryTime.current = now;
      bossTimeAlive.current = 0;
    }
    if (bossIsAlive && bossEntryTime.current !== null) {
      bossTimeAlive.current = now - bossEntryTime.current;
    }
    if (bossExists.current && !bossIsAlive && bossEntryTime.current !== null) {
      bossDeathCount.current   += 1;
      lastBossDeathTime.current = now;
      bossExists.current        = false;
      bossEntryTime.current     = null;
      bossTimeAlive.current     = 0;
      bulletWolfUnlocked.current = true;
      nextBossDelay.current = Math.max(20, nextBossDelay.current - 5);
      onBossDeath(); // ← notificar a Game.jsx
    }

    // ── Spawn del boss ─────────────────────────────────────────────────────

    if (!bossSpawned.current && now >= 45) {
      spawnEnemy('ship-wolf');
      bossSpawned.current   = true;
      bossExists.current    = true;
      bossEntryTime.current = now;
    }

    if (
      bossSpawned.current && !bossIsAlive &&
      lastBossDeathTime.current !== null &&
      now - lastBossDeathTime.current >= nextBossDelay.current
    ) {
      const nextBossType = bossDeathCount.current % 2 === 1 ? 'air-ship' : 'ship-wolf';
      spawnEnemy(nextBossType);
      bossExists.current        = true;
      bossEntryTime.current     = now;
      lastBossDeathTime.current = null;
    }

    // ── Dificultad ─────────────────────────────────────────────────────────

    const baseCap   = 4;
    const timeCap   = Math.floor(now / 25);
    const bossCap   = bossDeathCount.current * 2;
    const maxNormal = baseCap + timeCap + bossCap;

    const speedFactor = Math.max(0.2, 1 - now / 350);

    const baseDelays = {
      wolf:          3.25 * speedFactor,
      shark:         3.75 * speedFactor,
      'red-shark':   6.5  * speedFactor,
      'boat-wolf':   7.0  * speedFactor,
      'bullet-wolf': 12.5,
    };

    // ── Qué puede spawnear ahora ───────────────────────────────────────────

    const secBoss        = bossTimeAlive.current;
    const secDeath       = lastBossDeathTime.current !== null
      ? now - lastBossDeathTime.current : Infinity;
    const redSharkUnlocked = bossDeathCount.current >= 2 && !bossIsAlive;

    const activeTypes = [];

    if (bossIsAlive) {
      if (secBoss >= 8)  activeTypes.push('shark');
      if (secBoss >= 30) activeTypes.push('wolf');
      if (bossDeathCount.current >= 1 && secBoss >= 60) activeTypes.push('bullet-wolf');
    } else if (bossSpawned.current && lastBossDeathTime.current !== null) {
      activeTypes.push('wolf');
      activeTypes.push('shark');
      activeTypes.push('boat-wolf');
      if (redSharkUnlocked) activeTypes.push('red-shark');
      if (bulletWolfUnlocked.current && secDeath >= 5) activeTypes.push('bullet-wolf');
    } else {
      activeTypes.push('wolf');
      activeTypes.push('shark');
      if (now >= 8) activeTypes.push('boat-wolf');
    }

    // ── Conteo actual ──────────────────────────────────────────────────────

    const typeCounts = enemies.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});

    // ── Spawn efectivo ─────────────────────────────────────────────────────

    activeTypes.forEach((type) => {
      if (type === 'ship-wolf' || type === 'air-ship') return;

      const last  = lastSpawnTimes.current[type] ?? 0;
      const delay = baseDelays[type] ?? 2;
      const count = typeCounts[type] ?? 0;

      if (type === 'bullet-wolf') {
        if (count < 1 && now - last >= delay) {
          spawnEnemy('bullet-wolf');
          lastSpawnTimes.current[type] = now;
        }
        return;
      }

      let effectiveCap;
      if (type === 'boat-wolf') {
        effectiveCap = Math.min(2 + bossDeathCount.current, maxNormal);
      } else if (type === 'red-shark') {
        effectiveCap = Math.max(1, Math.ceil(maxNormal * 0.35));
      } else if (type === 'shark') {
        const redCount = typeCounts['red-shark'] ?? 0;
        effectiveCap   = Math.max(1, maxNormal - redCount);
      } else {
        effectiveCap = maxNormal;
      }

      if (count < effectiveCap && now - last >= delay) {
        spawnEnemy(type);
        lastSpawnTimes.current[type] = now;
        if (count + 1 < effectiveCap && type === 'wolf') {
          lastSpawnTimes.current[type] = now - delay / 2;
        }
      }
    });

    // ── Power-ups ──────────────────────────────────────────────────────────

    const puBase  = 18;
    const puMin   = 7;
    const puDelay = Math.max(puBase - Math.floor(now / 30) * 2, puMin);

    if (powerUps.length === 0 && now - lastPowerUpTime.current >= puDelay) {
      spawnPowerUp();
      lastPowerUpTime.current = now;
    }

  }, [timeElapsed, isGameActive, isGameOver, enemies, powerUps, spawnEnemy, spawnPowerUp, onBossDeath]);
}

export default useGameManager;