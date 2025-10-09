/*
  * Define el comportamiento del enemigo básico.
  * Se mueve de izquierda a derecha y se elimina si sale de pantalla.
*/
export function createBasicEnemy() {
    const minY = 60;
    const maxY = 400;
    const startY = minY + Math.random() * (maxY - minY);
  return {
    type: 'basic',
    x: 800,
    y: startY,
    health: 1,
    points: 50,
    speed: 2.5,
    rotation: 0,
    id: Math.random().toString(36).slice(2),
  };
}

export function updateBasicEnemy(enemy) {
  const newX = enemy.x - enemy.speed;
  if (newX > 820) return null; // fuera de pantalla
  return { ...enemy, x: newX };
}
