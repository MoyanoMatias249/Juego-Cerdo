// src/components/EnemyBullets.jsx
import cannonballSprite from '../../assets/sprites-enemies/bullet-cannon.png';

function EnemyBullets({ bullets, showHitboxes }) {
  return (
    <>
      {bullets.map((b, i) => {
        const sprite = cannonballSprite
        return (
          <>
            <img
                key={i}
                src={sprite}
                alt="enemy-bullet"
                className="cannonball"
                style={{
                  position: 'absolute',
                  left: `${b.x}px`,
                  top: `${b.y}px`,
                  width: '24px',
                  height: '24px',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />{showHitboxes && (
            <div
              style={{
                position: 'absolute',
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: '24px',
                height: '24px',
                border: '1px dashed red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          )}
        </>
        );
      })}
      
    </>
  );
}

export default EnemyBullets;
