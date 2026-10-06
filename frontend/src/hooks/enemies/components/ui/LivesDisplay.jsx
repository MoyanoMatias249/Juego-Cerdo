// src/components/ui/LivesDisplay.jsx
import heartFull  from '../../assets/sprites-ui/heart-1.png';
import heartHalf  from '../../assets/sprites-ui/heart-2.png';
import heartEmpty from '../../assets/sprites-ui/heart-3.png';

const HEARTS_BY_DIFFICULTY = {
  easy:   5,
  normal: 3,
  hard:   1,
};

function LivesDisplay({ lives, difficulty = 'normal' }) {
  const maxHearts = HEARTS_BY_DIFFICULTY[difficulty] ?? 3;
  const hearts    = [];

  for (let i = 0; i < maxHearts; i++) {
    const segment = lives - i * 2;
    let sprite = heartEmpty;
    if (segment >= 2) sprite = heartFull;
    else if (segment === 1) sprite = heartHalf;

    hearts.push(
      <img
        key={`heart-${i}`}
        src={sprite}
        alt={`heart-${i}`}
        style={{ width: '36px', height: '36px', marginRight: '3px' }}
      />
    );
  }

  return (
    <div style={{
      position:   'absolute',
      top:        '10px',
      left:       '10px',
      zIndex:     100,
      display:    'flex',
      alignItems: 'center',
    }}>
      {hearts}
    </div>
  );
}

export default LivesDisplay;