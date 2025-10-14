import { getPlayerData } from '../../utils/playerData';

function GameStats({ timeElapsed, score }) {
  const player = getPlayerData();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: '54px',
      left: '10px',
      color: '#222',
      fontSize: '18px',
      fontFamily: 'monospace',
      zIndex: 100,
      backgroundColor: '#00f2',
      padding: '4px 8px',
      borderRadius: '6px'
    }}>
      <div>Jugador: {player.name}</div>
      <div>Tiempo: {formatTime(timeElapsed)}</div>
      <div>Puntos: {score}</div>
    </div>
  );
}

export default GameStats;
