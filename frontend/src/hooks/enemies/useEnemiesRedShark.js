// src/hooks/enemies/useEnemiesRedShark.js
/*
  Tiburón rojo — emboscador dirigido al jugador.

  SWIMMING: entra desde la derecha, ondula suavemente en Y mientras nada
  (±8px, ciclo lento) para simular movimiento de aleta bajo el agua.
  No puede pasar a charging hasta haber viajado MIN_TRAVEL_PX (200px).

  CHARGING: pausa 22 frames y captura la dirección del jugador.

  JUMPING: salta en esa dirección con curvatura (rotation).
  Timer máximo de 90 frames antes de forzar caída.

  FALLING: cae a 4px/frame igual que el tiburón normal.
*/

const SWIM_SPEED_BASE = 2.2;
const SWIM_SPEED_MIN  = 0.4;
const CHARGE_FRAMES   = 22;
const JUMP_SPEED_Y    = 7;
const FALL_SPEED_Y    = 4;
const MAX_JUMP_FRAMES = 90;
const SURFACE_Y       = 400;   // Y base de nado
const SPAWN_X         = 850;
const MIN_TRAVEL_PX   = 200;   // debe avanzar este px antes de poder saltar
const WAVE_AMP        = 8;     // amplitud de ondulación en Y (px)
const WAVE_SPEED      = 0.07;  // velocidad de la onda (rad/frame)

export function createRedSharkEnemy() {
  return {
    type:        'red-shark',
    x:           SPAWN_X,
    y:           SURFACE_Y,
    state:       'swimming',
    health:      10,
    points:      300,
    chargeTimer: 0,
    jumpTimer:   0,
    jumpVx:      0,
    jumpVy:      -JUMP_SPEED_Y,
    rotation:    0,
    traveledPx:  0,
    wavePhase:   0,             // fase de la onda de nado
    id:          Math.random().toString(36).slice(2),
  };
}

export function updateRedSharkEnemy(enemy, playerX, playerY) {

  // ── SWIMMING ──────────────────────────────────────────────────────────────
  if (enemy.state === 'swimming') {
    const dx      = playerX - enemy.x;
    const distAbs = Math.abs(dx);

    // Velocidad X decrece cuanto más cerca está del jugador
    const t      = Math.min(1, distAbs / 300);
    const speedX = SWIM_SPEED_MIN + (SWIM_SPEED_BASE - SWIM_SPEED_MIN) * t;
    const dirX   = dx >= 0 ? 1 : -1;
    const newX   = enemy.x + dirX * speedX;

    // Ondulación en Y — onda sinusoidal suave
    const newPhase = enemy.wavePhase + WAVE_SPEED;
    const newY     = SURFACE_Y + Math.sin(newPhase) * WAVE_AMP;

    const newTravel   = enemy.traveledPx + speedX;
    const canJump     = newTravel >= MIN_TRAVEL_PX;
    const closeEnough = distAbs < 140;

    if (canJump && closeEnough) {
      return {
        ...enemy,
        x:           newX,
        y:           newY,
        wavePhase:   newPhase,
        traveledPx:  newTravel,
        state:       'charging',
        chargeTimer: 0,
      };
    }

    if (newX < -100) return null;

    return {
      ...enemy,
      x:          newX,
      y:          newY,
      wavePhase:  newPhase,
      traveledPx: newTravel,
    };
  }

  // ── CHARGING ──────────────────────────────────────────────────────────────
  if (enemy.state === 'charging') {
    // Sigue ondulando mientras carga para que no se vea estático
    const newPhase = enemy.wavePhase + WAVE_SPEED;
    const newY     = SURFACE_Y + Math.sin(newPhase) * WAVE_AMP;
    const newTimer = enemy.chargeTimer + 1;

    if (newTimer >= CHARGE_FRAMES) {
      const dx  = playerX - enemy.x;
      const dy  = playerY - enemy.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      const jumpVx   = (dx / len) * 4.5;
      const rotation = Math.atan2(jumpVx, JUMP_SPEED_Y) * (180 / Math.PI);

      return {
        ...enemy,
        y:           newY,
        wavePhase:   newPhase,
        state:       'jumping',
        chargeTimer: 0,
        jumpTimer:   0,
        jumpVx,
        jumpVy:      -JUMP_SPEED_Y,
        rotation,
      };
    }

    return {
      ...enemy,
      y:           newY,
      wavePhase:   newPhase,
      chargeTimer: newTimer,
    };
  }

  // ── JUMPING ───────────────────────────────────────────────────────────────
  if (enemy.state === 'jumping') {
    const newX     = enemy.x + enemy.jumpVx;
    const newY     = enemy.y + enemy.jumpVy;
    const newTimer = enemy.jumpTimer + 1;

    if (newTimer >= MAX_JUMP_FRAMES || newY < -120) {
      return {
        ...enemy,
        x:         newX,
        y:         newY,
        state:     'falling',
        jumpVx:    0,
        rotation:  0,
        jumpTimer: newTimer,
      };
    }

    return { ...enemy, x: newX, y: newY, jumpTimer: newTimer };
  }

  // ── FALLING ───────────────────────────────────────────────────────────────
  if (enemy.state === 'falling') {
    const newY = enemy.y + FALL_SPEED_Y;
    if (newY > 560) return null;
    return { ...enemy, y: newY, rotation: 0 };
  }

  return enemy;
}