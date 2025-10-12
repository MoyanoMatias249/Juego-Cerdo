import { useEffect, useState } from 'react';
import sharkFin from '../../assets/sprites-enemies/shark-fin.png';
import sharkBody from '../../assets/sprites-enemies/shark-body-2.png';
import sharkBodyBack from '../../assets/sprites-enemies/shark-body-back-2.png';

function EnemyShark({ x, y, state = 'fin', showHitboxes, hitTimestamp }) {
  const [isFlashing, setIsFlashing] = useState(false);

  // Elegir sprite según estado
  let sprite = sharkFin;
  let width = 82;
  let height = 56;
  let transform = 'none';

  if (state === 'jumping') {
    sprite = sharkBody;
    width = 84;
    height = 144;
  } else if (state === 'falling') {
    sprite = sharkBodyBack;
    width = 84;
    height = 144;
    transform = 'scaleY(-1)';
  }

  useEffect(() => {
      if (!hitTimestamp) return;
        setIsFlashing(true);
        const timeout = setTimeout(() => setIsFlashing(false), 120);
        return () => clearTimeout(timeout);
  }, [hitTimestamp]);

  const filter = isFlashing ? 'brightness(0.3)' : 'none';

  return (
    <div
      className="enemy-shark-wrapper"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 6,
        transform,
        transformOrigin: 'center center',
        filter,
      }}
    >
      <img
        src={sprite}
        alt="shark"
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
        }}
      />

      {/* Hitbox solo si está en cuerpo visible */}
      {showHitboxes && (state === 'jumping' || state === 'falling') && (
        <div
          style={{
            position: 'absolute',
            left: '10px',
            top: '10px',
            width: '64px',
            height: '80px',
            border: '2px dashed red',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

export default EnemyShark;
