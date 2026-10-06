// src/components/enemies/EnemyRedShark.jsx
import { useEffect, useState, useRef } from 'react';
import sharkFin1     from '../../assets/sprites-enemies/shark-red-fin-1.png';
import sharkFin2     from '../../assets/sprites-enemies/shark-red-fin-2.png';
import sharkBody     from '../../assets/sprites-enemies/shark-red-body-1.png';
import sharkBodyBack from '../../assets/sprites-enemies/shark-red-body-back-1.png';

const FIN_FRAMES   = [sharkFin1, sharkFin2];
const FIN_INTERVAL = 180; // ms por frame (≈ 5.5 FPS, movimiento suave)

function EnemyRedShark({ x, y, state = 'swimming', rotation = 0, showHitboxes, hitTimestamp }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [finFrame,   setFinFrame]   = useState(0);
  const finTimerRef                 = useRef(null);

  // Animación de la aleta — solo cuando está nadando o cargando
  useEffect(() => {
    const isUnderwater = state === 'swimming' || state === 'charging';
    if (!isUnderwater) {
      if (finTimerRef.current) clearInterval(finTimerRef.current);
      return;
    }
    finTimerRef.current = setInterval(() => {
      setFinFrame(f => (f + 1) % 2);
    }, FIN_INTERVAL);
    return () => clearInterval(finTimerRef.current);
  }, [state]);

  // Flash al recibir daño
  useEffect(() => {
    if (!hitTimestamp) return;
    setIsFlashing(true);
    const t = setTimeout(() => setIsFlashing(false), 120);
    return () => clearTimeout(t);
  }, [hitTimestamp]);

  // ── Sprite y dimensiones ──────────────────────────────────────────────────
  let sprite = FIN_FRAMES[finFrame];
  let width  = 82;
  let height = 56;

  if (state === 'jumping') {
    sprite = sharkBody;
    width  = 84;
    height = 144;
  } else if (state === 'falling') {
    sprite = sharkBodyBack;
    width  = 84;
    height = 144;
  }

  // ── Transformaciones ──────────────────────────────────────────────────────
  let transform = 'none';
  if (state === 'jumping') {
    transform = `rotate(${rotation}deg)`;
  } else if (state === 'falling') {
    transform = 'scaleY(-1)';
  }

  const filter = isFlashing ? 'brightness(0.3)' : 'none';

  return (
    <div
      className="enemy-red-shark-wrapper"
      style={{
        position:        'absolute',
        left:            x,
        top:             y,
        width:           `${width}px`,
        height:          `${height}px`,
        zIndex:          6,
        transform,
        transformOrigin: 'center center',
        filter,
      }}
    >
      <img
        src={sprite}
        alt="red-shark"
        style={{
          position:       'absolute',
          width:          `${width}px`,
          height:         `${height}px`,
          imageRendering: 'pixelated',
        }}
      />

      {showHitboxes && (state === 'jumping' || state === 'falling') && (
        <div style={{
          position:        'absolute',
          left:            '10px',
          top:             '10px',
          width:           '64px',
          height:          '80px',
          border:          '2px dashed orange',
          backgroundColor: 'rgba(255,100,0,0.15)',
          pointerEvents:   'none',
          zIndex:          10,
        }} />
      )}
    </div>
  );
}

export default EnemyRedShark;
