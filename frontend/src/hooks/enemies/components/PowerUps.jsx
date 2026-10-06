// src/components/PowerUps.jsx
import powerUpBox  from '../assets/sprites-ui/power-up-box.png';
import powerUpBoxD from '../assets/sprites-ui/power-up-damage.png';
import powerUpBoxP from '../assets/sprites-ui/power-up-piercing.png';
import powerUpBoxI from '../assets/sprites-ui/power-up-immune.png';

function PowerUps({ powerUps, showHitboxes }) {
  const getSprite = (type) => {
    if (type === 'damage')       return powerUpBoxD;
    if (type === 'piercing')     return powerUpBoxP;
    if (type === 'invulnerable') return powerUpBoxI;
    return powerUpBox;
  };

  return (
    <>
      {powerUps.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left:     `${p.x}px`,
            top:      `${p.y}px`,
            width:    '70px',
            height:   '124px',
            zIndex:   4,
          }}
        >
          <img
            src={getSprite(p.type)}
            alt={p.type}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          />
          {showHitboxes && (
            <div style={{
              position:        'absolute',
              left:            '12px',
              top:             '79px',
              width:           '40px',
              height:          '40px',
              border:          '2px dashed orange',
              backgroundColor: 'rgba(255,165,0,0.1)',
              pointerEvents:   'none',
            }} />
          )}
        </div>
      ))}
    </>
  );
}

export default PowerUps;