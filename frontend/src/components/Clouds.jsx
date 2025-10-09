function Clouds({ clouds }) {
  return (
    <>
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          src={cloud.sprite}
          alt="cloud"
          className="cloud"
          style={{
            left: `${cloud.x}px`,
            top: `${cloud.y}px`,
          }}
        />
      ))}
    </>
  );
}

export default Clouds;
