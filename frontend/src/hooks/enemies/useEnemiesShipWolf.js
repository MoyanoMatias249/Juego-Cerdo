// src/hooks/enemies/useEnemiesShipWolf.js
import { useState, useEffect } from 'react';

export function createShipWolfBoss() {
  return {
    type: 'ship-wolf',
    x: 800,
    y: 320,
    health: 250,
    points: 5000,
    phase: 'entry',
    direction: 'left',
    shootCooldown: 0,
    attackPattern: 'triple', // triple, barrage, cannon
    heads: [true, true, true], // 3 lobos activos
    id: Math.random().toString(36).slice(2),
    wavePhase: 0,
    baseY: 320,
    cannonToggle: true,
    shoot: { active: false, origin: null },
  };
}

export function updateShipWolfBoss(boss, playerX, playerY) {
  const newX = boss.x - 2.5;
  const waveOffset = Math.sin(Date.now() / 300 + boss.x / 50) * 5;
  const newY = boss.baseY + waveOffset;

  // Fase de entrada
  if (boss.phase === 'entry') {
    if (newX <= 475) {
      return { ...boss, x: 475, phase: 'attack', shootCooldown: 60, y: newY,};
    }
    return { 
      ...boss, 
      x: newX, 
      y: newY,
    };
  }

  // Fase de ataque
  if (boss.phase === 'attack') {
    const newCooldown = boss.shootCooldown - 1;

    // Cambio de patrón según salud
    let newPattern = boss.attackPattern;
    let newHeads = [...boss.heads];

    if (boss.health <= 160) {
      newPattern = 'barrage';
      newHeads[0] = false;
    }
    if (boss.health <= 60) {
      newPattern = 'cannon';
      newHeads[1] = false;
    }
    if (boss.health <= 0) {
      newHeads[2] = false;
    }

    if (newCooldown <= 0) {
      const nextToggle = newPattern === 'cannon' ? !boss.cannonToggle : boss.cannonToggle;
      const origin = newPattern === 'triple' ? 'bottom'
                    : newPattern === 'barrage' ? 'top'
                    : nextToggle ? 'top' : 'bottom';
      return {
        ...boss,
        shoot: { active: true, origin },
        shootCooldown: newPattern === 'cannon' ? 30 : newPattern === 'barrage' ? 90 : 75,
        attackPattern: newPattern,
        heads: newHeads,
        targetX: playerX,
        targetY: playerY,
        cannonToggle: nextToggle,
        y: newY,
      };
    }

    return {
      ...boss,
      shoot: { active: false, origin: null },
      shootCooldown: newCooldown,
      attackPattern: newPattern,
      heads: newHeads, 
      y: newY,
      
    };
  }

  return { ...boss, y: newY };
}
