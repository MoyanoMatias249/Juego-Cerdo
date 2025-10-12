function GameOverScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '800px',
        height: '500px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      GAME OVER
    </div>
  );
}

export default GameOverScreen;
