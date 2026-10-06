// src/components/enemies/EnemyBullets.jsx
import React from 'react';
import cannonballSprite from '../../assets/sprites-enemies/bullet-cannon.png';

function EnemyBullets({ bullets, showHitboxes }) {
  return (
    <>
      {bullets.map((b) => {
        const isCannon = b.type === 'cannonball';
        const sprite   = isCannon ? cannonballSprite : (b.sprite ?? cannonballSprite);
        const width    = isCannon ? 24 : 10;
        const height   = isCannon ? 24 : 10;
        const filtro   = !isCannon ? 'drop-shadow(0 0 2px #FF2B00)' : 'none';

        return (
          <React.Fragment key={b.id}>  {/* ← ID único */}
            <img
              src={sprite}
              alt="enemy-bullet"
              style={{
                position: 'absolute',
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: `${width}px`,
                height: `${height}px`,
                pointerEvents: 'none',
                zIndex: 4,
                filter: filtro,
              }}
            />
            {showHitboxes && (
              <div
                style={{
                  position: 'absolute',
                  left: `${b.x}px`,
                  top: `${b.y}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  border: '2px dashed lime',
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default EnemyBullets;
