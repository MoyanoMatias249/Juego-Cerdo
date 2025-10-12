// src/components/enemies/EnemyBoatWolf.jsx
import { useEffect, useState } from 'react';
import wolfBoat from '../../assets/sprites-enemies/boat-wolf.png';
import wolfHead from '../../assets/sprites-enemies/wolf-front-2.png';
import cannon from '../../assets/sprites-enemies/cannon.png';
import cannonExplosion1 from '../../assets/sprites-enemies/cannon-explosion-1.png';
import cannonExplosion2 from '../../assets/sprites-enemies/cannon-explosion-2.png';

const explosionFrames = [cannonExplosion1, cannonExplosion2];

function EnemyBoatWolf({ x, y, direction = 'right', showHitboxes, hitTimestamp, shoot }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [explosionFrame, setExplosionFrame] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionTrigger, setExplosionTrigger] = useState(0);

  const filter = isFlashing ? 'brightness(0.3)' : 'none';
  const flip = direction === 'left';

  // ⚡ Efecto de daño
  useEffect(() => {
    if (!hitTimestamp) return;
    setIsFlashing(true);
    const timeout = setTimeout(() => setIsFlashing(false), 120);
    return () => clearTimeout(timeout);
  }, [hitTimestamp]);

  // 💥 Detectar disparo y activar trigger
  useEffect(() => {
    if (shoot) {
      setExplosionTrigger((prev) => prev + 1); // fuerza reinicio
    }
  }, [shoot]);

  // 💥 Animación de explosión
  useEffect(() => {
    if (explosionTrigger === 0) return;

    setShowExplosion(true);
    setExplosionFrame(0);

    const frame1 = setTimeout(() => setExplosionFrame(1), 180);
    const hide = setTimeout(() => {
      setShowExplosion(false);
      setExplosionFrame(0);
    }, 360);

    return () => {
      clearTimeout(frame1);
      clearTimeout(hide);
    };
  }, [explosionTrigger]);

  return (
    <div
      className="enemy-boat-wolf-wrapper"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '122px',
        height: '98px',
        transform: flip ? 'scaleX(-1)' : 'none',
        transformOrigin: 'center center',
        zIndex: 5,
        filter,
      }}
    >

      {showExplosion && (
        <img
          src={explosionFrames[explosionFrame]}
          alt="cannon-explosion"
          style={{
            position: 'absolute',
            left: '36px',
            top: '-14px',
            width: '42px',
            height: '24px',
            zIndex: -2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Bote */}
      <img
        src={wolfBoat}
        alt="wolf-boat"
        style={{
          position: 'absolute',
          width: '122px',
          height: '98px',
        }}
      />

      {/* Cabeza del lobo */}
      <img
        src={wolfHead}
        alt="wolf-head"
        style={{
          position: 'absolute',
          left: '42px',
          top: '6px',
          width: '82px',
          height: '56px',
        }}
      />

      {/* Cañón */}
      <img
        src={cannon}
        alt="cannon"
        style={{
          position: 'absolute',
          left: '45px',
          top: '4px',
          width: '24px',
          height: '24px',
          zIndex: -1,
        }}
      />

      {/* Hitbox */}
      {showHitboxes && (
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '14px',
            width: '122px',
            height: '80px',
            border: '2px dashed red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

export default EnemyBoatWolf;
