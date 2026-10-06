// src/components/enemies/EnemyBulletWolf.jsx
import { useEffect, useState } from 'react';
import wolfPlane from '../../assets/sprites-enemies/bullet-wolf-side.png';
import wolfPlaneUp from '../../assets/sprites-enemies/bullet-wolf-side-up.png';
import wolfPlaneDown from '../../assets/sprites-enemies/bullet-wolf-side-down.png';
import wolfHead from '../../assets/sprites-enemies/wolf-side-4.png';

import propeller1 from '../../assets/sprites-player/propeller-side-1.png';
import propeller2 from '../../assets/sprites-player/propeller-side-2.png';
import propeller3 from '../../assets/sprites-player/propeller-side-3.png';
import propeller4 from '../../assets/sprites-player/propeller-side-4.png';
import propeller5 from '../../assets/sprites-player/propeller-side-5.png';
import propeller6 from '../../assets/sprites-player/propeller-side-6.png';

import useEnemyMuzzleFlash from '../../hooks/enemies/useEnemyMuzzleFlash';

const propellers = [propeller1, propeller2, propeller3, propeller4, propeller5, propeller6];

function EnemyBulletWolf({ x, y, direction = 'flat', propellerFrame, showHitboxes, hitTimestamp, shoot }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashSprite, triggerFlash] = useEnemyMuzzleFlash();

  const planeSprite = direction === 'up'
    ? wolfPlaneUp
    : direction === 'down'
    ? wolfPlaneDown
    : wolfPlane;

  useEffect(() => {
    if (!hitTimestamp) return;
    setIsFlashing(true);
    const timeout = setTimeout(() => setIsFlashing(false), 120);
    return () => clearTimeout(timeout);
  }, [hitTimestamp]);

  // ⚡ activar flash cuando dispara
  useEffect(() => {
    if (shoot?.active) {
      triggerFlash();
    }
  }, [shoot]);

  const filter = isFlashing ? 'brightness(0.3)' : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '102px',
        height: '44px',
        transform: 'scaleX(-1)',
        transformOrigin: 'center center',
        zIndex: 5,
        filter,
      }}
    >
      <img src={planeSprite} alt="bullet-wolf-plane" style={{ position: 'absolute', width: '102px', height: '44px' }} />
      <img src={wolfHead} alt="wolf" style={{ position: 'absolute', left: '12px', top: '-34px', width: '82px', height: '56px' }} />
      <img src={propellers[propellerFrame]} alt="propeller" style={{ position: 'absolute', left: '98px', top: '14px', width: '8px', height: '24px' }} />

      {/* Flash de disparo */}
      {flashSprite && (
        <img
          src={flashSprite}
          alt="muzzle-flash"
          style={{
            position: 'absolute',
            left: '90px',
            top: '20px',
            width: '22px',
            height: '22px',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
      )}

      {showHitboxes && (
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '-20px',
            width: '100px',
            height: '60px',
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

export default EnemyBulletWolf;
