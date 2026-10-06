// src/components/Bullets.jsx
function Bullets({ bullets }) {
  return (
    <>
      {bullets.map((b) => {
        const bulletFilter = b.piercing
          ? 'drop-shadow(0 0 4px #D100C6)'
          : b.damage > 1
          ? 'drop-shadow(0 0 4px #FF2B00)'
          : 'none';

        return (
          <img
            key={b.id}   // ← ID único en lugar de índice
            src={b.sprite}
            alt="bullet"
            className="bullet"
            style={{
              position: 'absolute',
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: '8px',
              height: '8px',
              transform: b.direction === 'down' ? 'rotate(90deg)' : 'none',
              pointerEvents: 'none',
              filter: bulletFilter,
            }}
          />
        );
      })}
    </>
  );
}

export default Bullets;