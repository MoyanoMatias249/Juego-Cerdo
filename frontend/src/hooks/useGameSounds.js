// src/hooks/useGameSounds.js

import shootSfx       from '../assets/sounds/shoot.mp3';
import cannonSfx      from '../assets/sounds/cannon-shoot.mp3';
import pigStartSfx    from '../assets/sounds/pig-intro.mp3';
import hitSfx         from '../assets/sounds/pig-damage.mp3';
import enemyDeathSfx  from '../assets/sounds/explode-retro1.mp3';
import powerUpSfx     from '../assets/sounds/power-up.mp3';

function useGameSounds() {
  const play = (src, volume = 1) => {
    if (!src) return;
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const playShoot      = () => play(shootSfx,      0.3);
  const playCannon     = () => play(cannonSfx,     0.3);
  const playPigStart   = () => play(pigStartSfx,   0.6);
  const playPigHurt    = () => play(hitSfx,        0.5);
  const playHit        = playPigHurt;
  const playEnemyDeath = () => play(enemyDeathSfx, 0.1);
  const playPowerUp    = () => play(powerUpSfx,    0.3);

  return { playShoot, playCannon, playPigStart, playPigHurt, playHit, playEnemyDeath, playPowerUp };
}

export default useGameSounds;