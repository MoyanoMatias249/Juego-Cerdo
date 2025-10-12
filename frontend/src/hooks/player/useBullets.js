import { useEffect, useState } from 'react';
import bulletSprite from '../../assets/sprites-player/bullet.png';

function useBullets(keys = {}, planeRef, viewMode, isGameActive) {
  const [bullets, setBullets] = useState([]);
  const [isHolding, setIsHolding] = useState(false);

  // Manejo de disparo inicial
  useEffect(() => {
    const spacePressed = keys.Space ?? false;

    if (spacePressed && !isHolding) {
      setIsHolding(true);
      shootBullet();
    } else if (!spacePressed && isHolding) {
      setIsHolding(false);
    }
  }, [keys.Space, isHolding]);

  // Disparo continuo
  useEffect(() => {
    if (!isHolding || !isGameActive) return;

    const interval = setInterval(() => {
      shootBullet();
    }, 150);

    return () => clearInterval(interval);
  }, [isHolding, viewMode, isGameActive]);

  // Movimiento de balas
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameActive) return;

      setBullets(prev =>
        prev
          .map(b => ({
            ...b,
            x: b.direction === 'right' ? b.x + 10 : b.x,
            y: b.direction === 'down' ? b.y + 10 : b.y,
          }))
          .filter(b =>
            (b.direction === 'right' && b.x < 820) ||
            (b.direction === 'down' && b.y < 520)
          )
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isGameActive]);

  const shootBullet = () => {
    const plane = planeRef.current;
    if (!plane) return;

    const left = parseInt(plane.style.left || '100');
    const top = parseInt(plane.style.top || '200');

    const damage = 1;
    const piercing = false;

    const bulletsToShoot = viewMode === 'horizontal'
      ? [
          { x: left + 104, y: top + 65, direction: 'right' },
          { x: left + 104, y: top + 75, direction: 'right' }
        ]
      : [
          { x: left + 41, y: top + 102, direction: 'down' },
          { x: left + 51, y: top + 102, direction: 'down' }
        ];

    const formatted = bulletsToShoot.map(b => ({
      ...b,
      sprite: bulletSprite,
      damage,
      piercing,
      hitEnemies: new Set()
    }));

    setBullets(prev => [...prev, ...formatted]);
  };

  return [bullets, setBullets];
}

export default useBullets;
