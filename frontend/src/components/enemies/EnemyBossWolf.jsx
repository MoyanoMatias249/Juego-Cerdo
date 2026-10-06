// src/components/enemies/EnemyBossWolf.jsx
import { useEffect, useState } from 'react';
import wolfShip from '../../assets/sprites-enemies/ship-boss-1.png'; // barco total 152x130
import wolfw1 from '../../assets/sprites-enemies/window-ship-1.png'; //abierta con lobo 26x21
import wolfw2 from '../../assets/sprites-enemies/window-ship-2.png'; // cerrada sin lobo 26x21
import wolfHead1 from '../../assets/sprites-enemies/wolf-front-2.png'; // lobo bandana rojo parche (igual al bote)  41x28
import wolfHead2 from '../../assets/sprites-enemies/wolf-front-3.png'; // lobo bandana verde cicatriz hojo 41x28
import wolfHead3 from '../../assets/sprites-enemies/wolf-front-4.png'; // lobo bandana negra (luego merare la banada) 

// Estos los use para el bote  pero talvez pueda reutilizarlos
import cannon from '../../assets/sprites-enemies/cannon.png';
import cannonExplosion1 from '../../assets/sprites-enemies/cannon-explosion-1.png';
import cannonExplosion2 from '../../assets/sprites-enemies/cannon-explosion-2.png';

const explosionFrames = [cannonExplosion1, cannonExplosion2];

function EnemyShipWolf({ x, y, heads, shoot, showHitboxes, hitTimestamp }) {
    const [isFlashing, setIsFlashing] = useState(false);
    const [explosionFrame, setExplosionFrame] = useState(0);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionTrigger, setExplosionTrigger] = useState(0);
    const [explosionOrigin, setExplosionOrigin] = useState(null);

    useEffect(() => {
      if (shoot?.active) {
        setExplosionTrigger((prev) => prev + 1);
        setExplosionOrigin(shoot.origin);
      }
    }, [shoot]);

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

    useEffect(() => {
        if (!hitTimestamp) return;
        setIsFlashing(true);
        const timeout = setTimeout(() => setIsFlashing(false), 120);
        return () => clearTimeout(timeout);
    }, [hitTimestamp]);

    const filter = isFlashing ? 'brightness(0.3)' : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '304px',
        height: '260px',
        zIndex: 4,
        filter,
      }}
    >
      {/* Barco */}
      <img src={wolfShip} alt="ship" style={{ position: 'absolute', top: -120, width: '304px', height: '260px' }} />

      {/* Ventanas y lobos */}
      {[0, 1, 2].map((i) => {
        const left = 110 + i * 65;
        const topOffset = i === 2 ? -10 : 0;
        return (
          <div key={i}>
            <img
              src={heads[i] ? wolfw1 : wolfw2}
              alt={`window-${i}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${60 + topOffset}px`,
                width: '42px',
                height: '26px',
              }}
            />
            {heads[i] && (
              <img
                src={[wolfHead1, wolfHead2, wolfHead3][i]}
                alt={`wolf-${i}`}
                style={{
                    position: 'absolute',
                    left: `${left - 18}px`,
                    top: `${28 + topOffset}px`,
                    width: '82px',
                    height: '56px',
                }}
              />
            )}
          </div>
        );
      })}
      

      {/* Explosión */}
      {showExplosion && explosionOrigin === 'top' && (
        <img src={explosionFrames[explosionFrame]} alt="explosion-top" style={{
          position: 'absolute',
          left: '56px',
          top: '-32px',
          width: '42px',
          height: '24px',
          pointerEvents: 'none',
          zIndex: -2,
        }} />
      )}

        {/* Cañón */}
        <img
            src={cannon}
            alt="cannon"
            style={{
            position: 'absolute',
            left: '65px',
            top: '-10px',
            width: '24px',
            height: '24px',
            zIndex: -1,
            }}
        />

        {/* Explosión */}
        {showExplosion && explosionOrigin === 'bottom' && (
          <img src={explosionFrames[explosionFrame]} alt="explosion-bottom" style={{
            position: 'absolute',
            left: '14px',
            top: '20px',
            width: '42px',
            height: '24px',
            pointerEvents: 'none',
            zIndex: -2,
            transform: 'rotate(270deg)',
          }} />
        )}

        {/* Cañón 2 */}
        <img
            src={cannon}
            alt="cannon"
            style={{
            position: 'absolute',
            left: '34px',
            top: '20px',
            width: '24px',
            height: '24px',
            zIndex: -1,
            transform: 'rotate(270deg)'
            }}
        />

      {/* Hitbox */}
      {showHitboxes && (
        <div
          style={{
            position: 'absolute',
            left: '50px',
            top: '0px',
            width: '250px',
            height: '300px',
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

export default EnemyShipWolf;