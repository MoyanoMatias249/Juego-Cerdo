// src/components/EnemyBullet.jsx
import React from 'react';
import bulletSprite from '../../assets/sprites-player/bullet.png';

function EnemyBullet({ x, y, showHitboxes }) {
  return (
    <>
      <img
        src={bulletSprite}
        alt="enemy-bullet"
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: '8px',
          height: '8px',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />
      {showHitboxes && (
        <div
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '8px',
            height: '8px',
            border: '2px dashed red',
            backgroundColor: 'rgba(255,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </>
  );
}

export default EnemyBullet;
