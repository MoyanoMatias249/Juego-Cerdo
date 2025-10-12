import { useEffect, useState } from 'react';
import wolfPlane from '../../assets/sprites-enemies/plane-wolf-side.png';
import wolfPlaneUp from '../../assets/sprites-enemies/plane-wolf-side-up.png';
import wolfPlaneDown from '../../assets/sprites-enemies/plane-wolf-side-down.png';
import wolfHead from '../../assets/sprites-enemies/wolf-side-3.png';

import propeller1 from '../../assets/sprites-player/propeller-side-1.png';
import propeller2 from '../../assets/sprites-player/propeller-side-2.png';
import propeller3 from '../../assets/sprites-player/propeller-side-3.png';
import propeller4 from '../../assets/sprites-player/propeller-side-4.png';
import propeller5 from '../../assets/sprites-player/propeller-side-5.png';
import propeller6 from '../../assets/sprites-player/propeller-side-6.png';

const propellers = [propeller1, propeller2, propeller3, propeller4, propeller5, propeller6];

function EnemyWolf({ x, y, direction = 'flat', propellerFrame, showHitboxes, hitTimestamp }) {
  const [isFlashing, setIsFlashing] = useState(false);

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

  const filter = isFlashing ? 'brightness(0.3)' : 'none';

  return (
    <div
      className="enemy-wolf-wrapper"
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
      {/* Avión */}
      <img
        src={planeSprite}
        alt="wolf-plane"
        style={{
          position: 'absolute',
          width: '102px',
          height: '44px',
        }}
      />

      {/* Cabeza del lobo */}
      <img
        src={wolfHead}
        alt="wolf"
        style={{
          position: 'absolute',
          left: '12px',
          top: '-34px',
          width: '82px',
          height: '56px',
        }}
      />

      {/* Hélice */}
      <img
        src={propellers[propellerFrame]}
        alt="propeller"
        style={{
          position: 'absolute',
          left: '98px',
          top: '14px',
          width: '8px',
          height: '24px',
        }}
      />

      {/* Hitbox */}
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

export default EnemyWolf;
