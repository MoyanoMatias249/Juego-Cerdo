// src/components/ui/GameOverScreen.jsx
import { useEffect, useState, useRef } from 'react';
import { getPlayerData, updatePlayerData } from '../../utils/playerData';

function GameOverScreen({ score, timeElapsed, onRetry, onMenu }) {
  const alreadyUpdatedRef = useRef(false);
  const [player,        setPlayer]        = useState(null);
  const [isNewMaxScore, setIsNewMaxScore] = useState(false);
  const [isNewMaxTime,  setIsNewMaxTime]  = useState(false);
  const [hover,         setHover]         = useState(null);

  useEffect(() => {
    if (!alreadyUpdatedRef.current) {
      const prev    = getPlayerData();
      const updated = updatePlayerData({ score, timeElapsed });
      setPlayer(updated);
      setIsNewMaxScore(score > 0 && score >= prev.maxScore);
      setIsNewMaxTime(timeElapsed > 0 && timeElapsed >= prev.maxTime);
      alreadyUpdatedRef.current = true;
    }
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const btn = (id, label, onClick, accentColor = '#fff') => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(id)}
      onMouseLeave={() => setHover(null)}
      style={{
        fontSize: '16px', padding: '11px 0', width: '220px',
        backgroundColor: hover === id ? accentColor : 'transparent',
        color: hover === id ? '#000' : accentColor,
        border: `2px solid ${accentColor}`, borderRadius: '7px',
        cursor: 'pointer', fontFamily: 'monospace',
        letterSpacing: '2px', transition: 'all 0.15s',
        fontWeight: 'bold',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0,
      width: '800px', height: '500px',
      backgroundColor: 'rgba(0,0,0,0.88)',
      color: 'white', fontFamily: 'monospace',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>

      <h1 style={{
        fontSize: '58px', margin: '0 0 22px 0',
        color: '#f87171', letterSpacing: '4px',
        textShadow: '0 0 20px rgba(248,113,113,0.5)',
      }}>
        GAME OVER
      </h1>

      <div style={{ fontSize: '21px', marginBottom: '8px' }}>
        Puntos: <strong style={{ color: '#facc15' }}>{score}</strong>
        {isNewMaxScore && <span style={{ color: 'gold', marginLeft: '10px', fontSize: '15px' }}>🎉 ¡Nuevo récord!</span>}
      </div>

      <div style={{ fontSize: '21px', marginBottom: '8px' }}>
        Tiempo: <strong style={{ color: '#facc15' }}>{formatTime(timeElapsed)}</strong>
        {isNewMaxTime && <span style={{ color: 'gold', marginLeft: '10px', fontSize: '15px' }}>⏱️ ¡Nuevo récord!</span>}
      </div>

      {player && (
        <div style={{ fontSize: '15px', color: '#888', marginBottom: '32px' }}>
          Intento #{player.attempts}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {btn('retry', 'REINTENTAR',   onRetry, '#facc15')}
        {btn('menu',  'IR AL MENÚ',   onMenu,  '#fff')}
      </div>
    </div>
  );
}

export default GameOverScreen;
