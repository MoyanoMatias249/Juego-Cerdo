// src/hooks/enemies/useEnemiesBulletWolf.js

export function createBulletWolfEnemy() {
  // Solo aparece en la mitad superior de la pantalla (y: 40 → 220)
  const minY = 40;
  const maxY = 220;
  const startY = minY + Math.random() * (maxY - minY);

  return {
    type: 'bullet-wolf',
    x: 800,
    y: startY,
    baseY: startY,
    health: 5,
    points: 150,
    speed: 1.5,
    wavePhase: 0,
    direction: 'flat',
    phase: 'idle',
    shootCooldown: 45,
    shoot: {
      active: false,
      attackId: 0,
    },
    id: Math.random().toString(36).slice(2),
  };
}

export function updateBulletWolfEnemy(enemy) {
  const newX     = enemy.x - enemy.speed;
  const newPhase = enemy.wavePhase + 0.08;

  // La onda sinusoidal se mantiene acotada a la mitad superior:
  // baseY está entre 40-220, la onda agrega ±25px → máximo y ≈ 245, mínimo y ≈ 15
  const newY = enemy.baseY + Math.sin(newPhase) * 25;

  const dy        = Math.sin(newPhase);
  const direction = dy > 0.3 ? 'down' : dy < -0.3 ? 'up' : 'flat';

  if (newX < -120) return null;

  if (enemy.phase === 'idle') {
    if (enemy.shootCooldown <= 0) {
      return {
        ...enemy,
        x: newX,
        y: newY,
        wavePhase: newPhase,
        direction,
        phase: 'attack',
        shoot: { active: true, attackId: enemy.shoot.attackId + 1 },
        shootCooldown: 1,
      };
    }
    return {
      ...enemy,
      x: newX,
      y: newY,
      wavePhase: newPhase,
      direction,
      shootCooldown: enemy.shootCooldown - 1,
    };
  }

  if (enemy.phase === 'attack') {
    if (enemy.shootCooldown <= 0) {
      return {
        ...enemy,
        x: newX,
        y: newY,
        wavePhase: newPhase,
        direction,
        phase: 'idle',
        shoot: { active: false, attackId: enemy.shoot.attackId },
        shootCooldown: 60,
      };
    }
    return {
      ...enemy,
      x: newX,
      y: newY,
      wavePhase: newPhase,
      direction,
      shootCooldown: enemy.shootCooldown - 1,
    };
  }

  return {
    ...enemy,
    x: newX,
    y: newY,
    wavePhase: newPhase,
    direction,
  };
}