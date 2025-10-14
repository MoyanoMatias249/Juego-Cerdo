const STORAGE_KEY = 'jugador';

export function getPlayerData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);

  const defaultPlayer = {
    name: 'Usuario',
    maxScore: 0,
    maxTime: 0,
    attempts: 0,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlayer));
  return defaultPlayer;
}

export function updatePlayerData({ score, timeElapsed }) {
  const player = getPlayerData();
  const newMaxScore = Math.max(player.maxScore, score);
  const newMaxTime = Math.max(player.maxTime, timeElapsed);

  const updated = {
    ...player,
    maxScore: newMaxScore,
    maxTime: newMaxTime,
    attempts: player.attempts + 1,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetPlayerData() {
  localStorage.removeItem(STORAGE_KEY);
}
