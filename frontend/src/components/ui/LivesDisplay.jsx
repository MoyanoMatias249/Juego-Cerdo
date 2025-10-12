import heartFull from '../../assets/sprites-ui/heart-1.png';
import heartHalf from '../../assets/sprites-ui/heart-2.png';
import heartEmpty from '../../assets/sprites-ui/heart-3.png';

function LivesDisplay({ lives }) {
  const hearts = [];

  for (let i = 0; i < 3; i++) {
    const segment = lives - i * 2;
    let sprite = heartEmpty;
    if (segment >= 2) sprite = heartFull;
    else if (segment === 1) sprite = heartHalf;

    hearts.push(
      <img
        key={i}
        src={sprite}
        alt={`heart-${i}`}
        style={{
          width: '40px',
          height: '40px',
          marginRight: '4px',
        }}
      />
    );
  }

  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100 }}>
      {hearts}
    </div>
  );
}

export default LivesDisplay;
