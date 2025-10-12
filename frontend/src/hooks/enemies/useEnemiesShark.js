/*
  * Define el comportamiento del tiburón emboscador.
  * Nada como aleta, luego salta verticalmente y cae.
*/

export function createSharkEnemy() {
  return {
    type: 'shark',
    x: Math.random() * 700 + 50,
    y: 520, // empieza fuera de pantalla
    state: 'emerging', // nuevo estado
    health: 8,
    points: 200,
    jumpTimer: 0,
    jumpStartX: null,
    jumpStartY: null,
    id: Math.random().toString(36).slice(2),
  };
}


export function updateSharkEnemy(enemy) {
  const speedX = 1.2;
  const jumpDelay = 120;
  const jumpSpeedY = 6;
  const fallSpeedY = 4;

  // Entrada desde abajo
  if (enemy.state === 'emerging') {
    const newY = enemy.y - 2;
    if (newY <= 410) {
      return {
        ...enemy,
        y: 410,
        state: 'fin',
      };
    }
    return {
      ...enemy,
      y: newY,
    };
  }

  // Movimiento horizontal como aleta
  if (enemy.state === 'fin') {
    const newX = enemy.x + (Math.random() < 0.5 ? -speedX : speedX);
    const clampedX = Math.max(0, Math.min(700, newX));
    const newTimer = enemy.jumpTimer + 1;

    if (newTimer >= jumpDelay) {
      return {
        ...enemy,
        state: 'jumping',
        jumpStartX: clampedX,
        jumpStartY: enemy.y,
      };
    }

    return {
      ...enemy,
      x: clampedX,
      jumpTimer: newTimer,
    };
  }

  // Salto vertical
  if (enemy.state === 'jumping') {
    const newY = enemy.y - jumpSpeedY;
    if (newY < -100) {
      return {
        ...enemy,
        state: 'falling',
      };
    }
    return {
      ...enemy,
      y: newY,
    };
  }

  // Caída
  if (enemy.state === 'falling') {
    const newY = enemy.y + fallSpeedY;
    if (newY > 520) return null;

    return {
      ...enemy,
      y: newY,
    };
  }

  return enemy;
}
