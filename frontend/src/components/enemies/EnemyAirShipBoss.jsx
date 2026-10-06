// src/components/enemies/EnemyAirShipBoss.jsx
import { useEffect, useState } from 'react';

import airShip1    from '../../assets/sprites-enemies/air-ship-boss-1.png';
import airShip2    from '../../assets/sprites-enemies/air-ship-boss-2.png';
import rope1       from '../../assets/sprites-enemies/air-ship-boss-rope-1.png';
import rope2       from '../../assets/sprites-enemies/air-ship-boss-rope-2.png';
import windowOpen  from '../../assets/sprites-enemies/window-ship-1.png';
import windowClosed from '../../assets/sprites-enemies/window-ship-2.png';
import wolfPatch   from '../../assets/sprites-enemies/wolf-front-5.png';  // fase 1
import wolfSleep   from '../../assets/sprites-enemies/wolf-front-6.png';  // fase 1 (desaparece en fase 2)
import wolfSerious from '../../assets/sprites-enemies/wolf-front-7.png';  // fase 2 (reemplaza al de sueño)
import prop1 from '../../assets/sprites-enemies/air-ship-propeller-1.png';
import prop2 from '../../assets/sprites-enemies/air-ship-propeller-2.png';
import prop3 from '../../assets/sprites-enemies/air-ship-propeller-3.png';
import prop4 from '../../assets/sprites-enemies/air-ship-propeller-4.png';
import prop5 from '../../assets/sprites-enemies/air-ship-propeller-5.png';
import prop6 from '../../assets/sprites-enemies/air-ship-propeller-6.png';

const PROPELLER_FRAMES = [prop1, prop2, prop3, prop4, prop5, prop6];
const SHIP_FRAMES      = [airShip1, airShip2];
const ROPE_FRAMES      = [rope1, rope2];

/*
  LAYOUT DEL AIR-SHIP (152x152 px base, escalado x2 → 304x304):
  ─────────────────────────────────────────────────────────────
  El globo está en la parte superior del sprite.
  El barco está en la parte inferior.
  Las cuerdas van ENCIMA del barco pero DEBAJO del globo.
  Los lobos y ventana salen de la ventanilla del barco.

  Capas (de atrás a frente):
    1. Barco (airShip1/2)
    2. Ventana (windowOpen/Closed)
    3. Cabezas de lobos
    4. Hélice
    5. Cuerdas (rope1/2) — encima de todo excepto UI
*/

// Tamaños escalados x2 (sprites 152px → 304px; wolves 41x28 → 82x56)
const W = 304;
const H = 304;
const WOLF_W = 82;
const WOLF_H = 56;
const WIN_W  = 52;   // 26x2
const WIN_H  = 42;   // 21x2
const PROP_W = 24;
const PROP_H = 80;

function EnemyAirShipBoss({ x, y, wolf2Gone, shipFrame = 0, propFrame = 0, shoot, showHitboxes, hitTimestamp, phase }) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!hitTimestamp) return;
    setIsFlashing(true);
    const t = setTimeout(() => setIsFlashing(false), 120);
    return () => clearTimeout(t);
  }, [hitTimestamp]);

  const isPhase2 = wolf2Gone;
  const filter   = isFlashing ? 'brightness(0.3)' : 'none';

  const shipSprite = SHIP_FRAMES[shipFrame % 2];
  const ropeSprite = ROPE_FRAMES[shipFrame % 2];
  const propSprite = PROPELLER_FRAMES[propFrame % 6];

  // Lobo izquierdo: parche → serio en fase 2
  const wolfLeft  = wolfPatch;
  // Lobo derecho: sueño → desaparece en fase 2
  const showWolfRight = !wolf2Gone;
  const wolfRight = isPhase2 ? wolfSerious : wolfSleep;

  return (
    <div
      style={{
        position: 'absolute',
        left:     x,
        top:      y,
        width:    `${W}px`,
        height:   `${H}px`,
        zIndex:   4,
        filter,
      }}
    >
      {/* ── Barco (capa base) ─────────────────────────────────────────── */}
      <img
        src={shipSprite}
        alt="air-ship"
        style={{
          position: 'absolute',
          left:     0,
          top:      0,
          width:    `${W}px`,
          height:   `${H}px`,
        }}
      />

      {/* ── Ventana ───────────────────────────────────────────────────── */}
      {/* Posición ajustada visualmente al centro-inferior del barco */}
      <img
        src={showWolfRight ? windowOpen : windowClosed}
        alt="window-left"
        style={{
          position: 'absolute',
          left:     `${90}px`,
          top:      `${192.5}px`,
          width:    `${WIN_W}px`,
          height:   `${WIN_H}px`,
          zIndex:   2,
        }}
      />

      {/* Segunda ventana (lobo derecho) */}
      <img
        src={windowOpen}
        alt="window-right"
        style={{
          position: 'absolute',
          left:     `${150}px`,
          top:      `${192.5}px`,
          width:    `${WIN_W}px`,
          height:   `${WIN_H}px`,
          zIndex:   2,
        }}
      />

      {/* ── Lobo izquierdo (parche → serio) ───────────────────────────── */}
      {showWolfRight && (
        <img
        src={wolfLeft}
        alt="wolf-left"
        style={{
          position: 'absolute',
          left:     `${76}px`,
          top:      `${175}px`,
          width:    `${WOLF_W}px`,
          height:   `${WOLF_H}px`,
          zIndex:   3,
        }}
      />
      )}
      

      {/* ── Lobo derecho (sueño → desaparece) ─────────────────────────── */}
        <img
            src={wolfRight}
            alt="wolf-right"
            style={{
            position: 'absolute',
            left:     `${136}px`,
            top:      `${175}px`,
            width:    `${WOLF_W}px`,
            height:   `${WOLF_H}px`,
            zIndex:   3,
            }}
        />


      {/* ── Hélice (al lado derecho del barco) ────────────────────────── */}
      <img
        src={propSprite}
        alt="propeller"
        style={{
          position: 'absolute',
          left:     `${286}px`,
          top:      `${202}px`,
          width:    `${PROP_W}px`,
          height:   `${PROP_H}px`,
          zIndex:   3,
        }}
      />

      {/* ── Cuerdas (capa más alta, sobre el barco pero bajo el globo) ── */}
      <img
        src={ropeSprite}
        alt="ropes"
        style={{
          position: 'absolute',
          left:     0,
          top:      0,
          width:    `${W}px`,
          height:   `${H}px`,
          zIndex:   5,    // encima de lobos y ventana, el globo ya está en el sprite
          pointerEvents: 'none',
        }}
      />

      {/* ── Hitbox de debug ───────────────────────────────────────────── */}
      {showHitboxes && (
        <div
          style={{
            position:        'absolute',
            left:            '30px',
            top:             '50px',
            width:           '240px',
            height:          '240px',
            border:          '2px dashed orange',
            backgroundColor: 'rgba(255, 150, 0, 0.1)',
            pointerEvents:   'none',
            zIndex:          10,
          }}
        />
      )}
    </div>
  );
}

export default EnemyAirShipBoss;
