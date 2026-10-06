// src/hooks/enemies/useEnemiesAirShipBoss.js

const ENTRY_X             = 480;
const CHARGE_TARGET_X     = 0;    // hasta donde avanza en la embestida (borde izquierdo)
const Y_TOP               = -30;
const Y_BOTTOM            = 140;
const PATROL_SPEED        = 1.5;  // sube/baja fase 1
const PATROL_SPEED_P2     = 3.0;  // sube/baja fase 2
const ENTRY_SPEED         = 3.5;  // velocidad de entrada horizontal (sin subi-baja)
const CHARGE_SPEED        = 9;
const RETREAT_SPEED       = 6;
const FORCE_RETREAT_SPEED = 9;
const EXIT_SPEED          = 7;
const PRE_CHARGE_FRAMES   = 60;
const CHARGE_TIMER_MIN    = 120;
const CHARGE_TIMER_MAX    = 300;
const SHOOT_CD_P2         = 100;
const SPREAD_P1           = 0.22;
const SPREAD_P2           = 0.42;
const PHASE2_HP           = 125;
const MAX_LIFETIME        = 60000;

function randomChargeTimer() {
  return CHARGE_TIMER_MIN + Math.floor(Math.random() * (CHARGE_TIMER_MAX - CHARGE_TIMER_MIN));
}

export function createAirShipBoss() {
  return {
    type:           'air-ship',
    x:              900,
    y:              Y_TOP,
    health:         350,
    points:         6000,
    phase:          'entry',
    moveDir:        1,
    patrolTimer:    0,
    chargeTimer:    randomChargeTimer(),
    preChargeTimer: 0,
    lifetime:       0,
    wolf2Gone:      false,
    wasPhase2:      false,
    propFrame:      0,
    propTimer:      0,
    shipFrame:      0,
    shipTimer:      0,
    targetX:        400,
    targetY:        250,
    spread:         SPREAD_P1,
    shoot:          { active: false, attackId: 0 },
    shootCooldown:  SHOOT_CD_P2,
    id:             Math.random().toString(36).slice(2),
  };
}

export function updateAirShipBoss(boss, playerX, playerY) {
  const isPhase2          = boss.health <= PHASE2_HP;
  const justEnteredPhase2 = isPhase2 && !boss.wasPhase2;

  // Animaciones
  const newPropTimer = boss.propTimer + 1;
  const newPropFrame = newPropTimer >= 6 ? (boss.propFrame + 1) % 6 : boss.propFrame;
  const newShipTimer = boss.shipTimer + 1;
  const newShipFrame = newShipTimer >= 18 ? (boss.shipFrame + 1) % 2 : boss.shipFrame;

  const animBase = {
    propFrame:  newPropFrame,
    propTimer:  newPropTimer >= 6 ? 0 : newPropTimer,
    shipFrame:  newShipFrame,
    shipTimer:  newShipTimer >= 18 ? 0 : newShipTimer,
    wolf2Gone:  isPhase2,
    wasPhase2:  isPhase2,
    lifetime:   boss.lifetime + 1,
    spread:     isPhase2 ? SPREAD_P2 : SPREAD_P1,
  };

  if (boss.lifetime >= MAX_LIFETIME && boss.phase !== 'retreat_exit') {
    return { ...boss, ...animBase, phase: 'retreat_exit' };
  }

  // ── Transición forzada a fase 2 ───────────────────────────────────────────
  if (justEnteredPhase2 && boss.phase !== 'retreat_exit') {
    return {
      ...boss, ...animBase,
      phase:         'force_retreat',
      shoot:         { active: false, attackId: boss.shoot.attackId },
      shootCooldown: SHOOT_CD_P2,
    };
  }

  // ── ENTRY — solo movimiento horizontal, sin subi-baja ─────────────────────
  if (boss.phase === 'entry') {
    const newX = boss.x - ENTRY_SPEED;

    if (newX <= ENTRY_X) {
      return {
        ...boss, ...animBase,
        x:           ENTRY_X,
        y:           boss.y,
        phase:       'patrol',
        patrolTimer: 0,
        chargeTimer: randomChargeTimer(),
        shoot:       { active: false, attackId: boss.shoot.attackId },
      };
    }
    // X fija durante entry, Y no cambia
    return { ...boss, ...animBase, x: newX };
  }

  // ── PATROL — quieto en X, sube y baja ────────────────────────────────────
  if (boss.phase === 'patrol') {
    const newY   = boss.y + boss.moveDir * PATROL_SPEED;
    let newDir   = boss.moveDir;
    let clampY   = newY;
    if (newY <= Y_TOP)    { clampY = Y_TOP;    newDir = 1;  }
    if (newY >= Y_BOTTOM) { clampY = Y_BOTTOM; newDir = -1; }

    const newChargeTimer = boss.chargeTimer - 1;

    if (newChargeTimer <= 0) {
      return {
        ...boss, ...animBase,
        x:              ENTRY_X,   // asegurar que esté en su posición
        y:              clampY,
        moveDir:        newDir,
        phase:          'pre_charge',
        preChargeTimer: 0,
        chargeTimer:    randomChargeTimer(),
        targetX:        playerX,
        targetY:        playerY,
        shoot:          { active: false, attackId: boss.shoot.attackId },
      };
    }

    return {
      ...boss, ...animBase,
      x:           ENTRY_X,   // bloqueado en X durante patrol
      y:           clampY,
      moveDir:     newDir,
      chargeTimer: newChargeTimer,
      targetX:     playerX,
      targetY:     playerY,
    };
  }

  // ── PRE_CHARGE — quieto (sin subi-baja) durante la pausa ─────────────────
  if (boss.phase === 'pre_charge') {
    const newPreTimer = boss.preChargeTimer + 1;

    if (newPreTimer >= PRE_CHARGE_FRAMES) {
      return {
        ...boss, ...animBase,
        phase:          'charge',
        preChargeTimer: 0,
        shoot:          { active: false, attackId: boss.shoot.attackId },
      };
    }

    // Quieto en X e Y durante la pausa
    return {
      ...boss, ...animBase,
      x:              ENTRY_X,
      preChargeTimer: newPreTimer,
      targetX:        playerX,
      targetY:        playerY,
    };
  }

  // ── CHARGE — avanza en línea recta hasta CHARGE_TARGET_X ─────────────────
  if (boss.phase === 'charge') {
    const newX = boss.x - CHARGE_SPEED;

    // Llegó al borde izquierdo → retreat
    if (newX <= CHARGE_TARGET_X) {
      return {
        ...boss, ...animBase,
        x:     CHARGE_TARGET_X,
        phase: 'retreat',
        shoot: { active: false, attackId: boss.shoot.attackId },
      };
    }

    return { ...boss, ...animBase, x: newX };
  }

  // ── RETREAT — vuelve a ENTRY_X en línea recta (sin subi-baja) ────────────
  if (boss.phase === 'retreat') {
    const newX = boss.x + RETREAT_SPEED;

    if (newX >= ENTRY_X) {
      return {
        ...boss, ...animBase,
        x:           ENTRY_X,
        phase:       'patrol',
        patrolTimer: 0,
        chargeTimer: randomChargeTimer(),
        shoot:       { active: false, attackId: boss.shoot.attackId },
      };
    }

    return { ...boss, ...animBase, x: newX };
  }

  // ── FORCE_RETREAT — regresa rápido a ENTRY_X al cambiar de fase ──────────
  if (boss.phase === 'force_retreat') {
    const newX = boss.x + FORCE_RETREAT_SPEED;

    if (newX >= ENTRY_X) {
      return {
        ...boss, ...animBase,
        x:             ENTRY_X,
        phase:         'patrol_p2',
        shootCooldown: SHOOT_CD_P2 * 2,
        shoot:         { active: false, attackId: boss.shoot.attackId },
      };
    }

    return {
      ...boss, ...animBase,
      x:     newX,
      shoot: { active: false, attackId: boss.shoot.attackId },
    };
  }

  // ── PATROL_P2 — quieto en X, sube/baja rápido, dispara ───────────────────
  if (boss.phase === 'patrol_p2') {
    const newY   = boss.y + boss.moveDir * PATROL_SPEED_P2;
    let newDir   = boss.moveDir;
    let clampY   = newY;
    if (newY <= Y_TOP)    { clampY = Y_TOP;    newDir = 1;  }
    if (newY >= Y_BOTTOM) { clampY = Y_BOTTOM; newDir = -1; }

    let newShoot         = { active: false, attackId: boss.shoot.attackId };
    let newShootCooldown = boss.shootCooldown - 1;

    if (newShootCooldown <= 0) {
      newShoot         = { active: true, attackId: boss.shoot.attackId + 1 };
      newShootCooldown = SHOOT_CD_P2;
    }

    return {
      ...boss, ...animBase,
      x:             ENTRY_X,   // bloqueado en X
      y:             clampY,
      moveDir:       newDir,
      shoot:         newShoot,
      shootCooldown: newShootCooldown,
      targetX:       playerX,
      targetY:       playerY,
    };
  }

  // ── RETREAT_EXIT ──────────────────────────────────────────────────────────
  if (boss.phase === 'retreat_exit') {
    const newX = boss.x + EXIT_SPEED;
    if (newX > 950) return null;
    return { ...boss, ...animBase, x: newX };
  }

  return { ...boss, ...animBase };
}