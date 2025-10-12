export function createBoatWolfEnemy() {
  const fromLeft = Math.random() < 0.5;
  const baseY = 360 + Math.random() * 30;
  
  const direction = fromLeft ? 'right' : 'left';
  const startX = fromLeft ? -120 : 820;
  const targetX = 150 + Math.random() * 500; // entre 150 y 650

  return {
    type: 'boat-wolf',
    x: startX,
    y: baseY,
    baseY,
    direction,
    speed: 2,
    phase: 'approach',
    targetX,
    shootCooldown: 0,
    health: 20,
    points: 500,
    lifeTime: 0, 
    id: Math.random().toString(36).slice(2),
  };
}

export function updateBoatWolfEnemy(enemy, playerX, playerY) {
  const waveOffset = Math.sin(Date.now() / 300 + enemy.x / 50) * 5; // ±5px
  const newY = enemy.baseY + waveOffset;

  const updatedLifeTime = (enemy.lifeTime ?? 0) + 1;
  if (updatedLifeTime > 900 && enemy.phase !== 'retreat') {
    return {
      ...enemy,
      phase: 'retreat',
      lifeTime: updatedLifeTime,
    };
  }

  if (enemy.phase === 'approach') {
    const dx = enemy.direction === 'right' ? 1 : -1;
    const newX = enemy.x + dx * enemy.speed;

    if ((dx > 0 && newX >= enemy.targetX) || (dx < 0 && newX <= enemy.targetX)) {
      return {
        ...enemy,
        x: enemy.targetX,
        y: newY,
        phase: 'aim',
        shootCooldown: 60,
        lifeTime: updatedLifeTime,
      };
    }

    return {
      ...enemy,
      x: newX,
      y: newY,
      lifeTime: updatedLifeTime,
    };
  }

  if (enemy.phase === 'aim') {
    if (enemy.shootCooldown <= 0) {
      return {
        ...enemy,
        phase: 'shoot',
        shoot: true,
        targetX: playerX,
        targetY: playerY,
        y: newY,
        lifeTime: updatedLifeTime,
      };
    }

    return {
      ...enemy,
      shootCooldown: enemy.shootCooldown - 1,
      y: newY,
      lifeTime: updatedLifeTime,
    };
  }

  if (enemy.phase === 'shoot') {
    return {
      ...enemy,
      shoot: false,
      shootCooldown: 90,
      phase: 'aim',
      y: newY,
      lifeTime: updatedLifeTime,
    };
  }
    if (enemy.phase === 'retreat') {
    const dx = enemy.direction === 'right' ? 1 : -1;
    const newX = enemy.x + dx * enemy.speed * 1.5; // se va más rápido

    // Eliminar cuando sale completamente
    if (newX < -150 || newX > 850) return null;

    return {
      ...enemy,
      x: newX,
      y: newY,
      lifeTime: updatedLifeTime,
    };
  }

  return {
    ...enemy,
    y: newY,
    lifeTime: updatedLifeTime,
  };
}