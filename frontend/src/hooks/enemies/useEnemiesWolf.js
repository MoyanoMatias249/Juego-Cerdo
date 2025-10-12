/*
  * Define el comportamiento del enemigo lobo volador.
  * Vuela en patrón sinusoidal mientras avanza en X.
*/

export function createWolfEnemy() {
  const minY = 60;
  const maxY = 400;
  const startY = minY + Math.random() * (maxY - minY);

  return {
    type: 'wolf',
    x: 800,
    y: startY,
    baseY: startY,
    health: 3,
    points: 100,
    speed: 2.5,
    wavePhase: 0,
    direction: 'flat', // puede ser 'up', 'down' o 'flat' para elegir sprite
    id: Math.random().toString(36).slice(2),
  };
}

export function updateWolfEnemy(enemy) {
  const newX = enemy.x - enemy.speed;
  const newPhase = enemy.wavePhase + 0.1;
  const newY = enemy.baseY + Math.sin(newPhase) * 20;

  // Detectar dirección visual
  const dy = Math.sin(newPhase);
  const direction = dy > 0.3 ? 'down' : dy < -0.3 ? 'up' : 'flat';

  if (newX < -120) return null;

  return {
    ...enemy,
    x: newX,
    y: newY,
    wavePhase: newPhase,
    direction,
  };
}
