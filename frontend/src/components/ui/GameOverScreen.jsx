import { useEffect, useState, useRef } from 'react';
import { getPlayerData, updatePlayerData } from '../../utils/playerData';

function GameOverScreen({ score, timeElapsed, onRetry, onReload }) {
  const alreadyUpdatedRef = useRef(false);
  const [player, setPlayer] = useState(null);
  const [isNewMaxScore, setIsNewMaxScore] = useState(false);
  const [isNewMaxTime, setIsNewMaxTime] = useState(false);

  useEffect(() => {
    if (!alreadyUpdatedRef.current) {
      const updated = updatePlayerData({ score, timeElapsed });
      setPlayer(updated);
      setIsNewMaxScore(score >= updated.maxScore);
      setIsNewMaxTime(timeElapsed >= updated.maxTime);
      alreadyUpdatedRef.current = true;
    }
  }, []);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '800px',
      height: '500px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeInGameOver 0.8s ease-out',
    }}>
      <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>GAME OVER</h1>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        Puntos: {score} {isNewMaxScore && <span style={{ color: 'gold' }}>🎉 Nuevo récord!</span>}
      </div>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        Tiempo: {formatTime(timeElapsed)} {isNewMaxTime && <span style={{ color: 'gold' }}>⏱️ Nuevo récord!</span>}
      </div>
      <div style={{ fontSize: '18px', marginBottom: '30px' }}>
        Intentos: {player?.attempts}
      </div>
      <button onClick={onRetry} style={buttonStyle}>Volver a intentar</button>
      <button onClick={onReload} style={{ ...buttonStyle, marginTop: '10px' }}>Volver al inicio</button>
    </div>
  );
}

const buttonStyle = {
  fontSize: '18px',
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: '#000',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default GameOverScreen;
