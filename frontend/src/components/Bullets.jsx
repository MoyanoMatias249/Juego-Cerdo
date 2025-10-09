function Bullets({ bullets }) {
  return (
    <>
      {bullets.map((b, i) => (
        <img
          key={i}
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
          }}
        />
      ))}
    </>
  );
}


export default Bullets;
