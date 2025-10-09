import { useEffect, useState } from 'react';

import bulletSprite from '../../assets/sprites-player/bullet.png';

function useBullets(keys, planeRef, viewMode, isGameActive) {
  const [bullets, setBullets] = useState([]);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (!keys || typeof keys.Space === 'undefined') return;

    if (keys.Space && !isHolding) {
      setIsHolding(true);
      shootBullet();
    } else if (!keys.Space && isHolding) {
      setIsHolding(false);
    }
  }, [keys?.Space]);

  useEffect(() => {
    if (!isHolding) return;

    const interval = setInterval(() => {
      shootBullet();
    }, 150);

    return () => clearInterval(interval);
  }, [isHolding, viewMode]);

  const shootBullet = () => {
    const plane = planeRef.current;
    if (!plane) return;

    const left = parseInt(plane.style.left || '100');
    const top = parseInt(plane.style.top || '200');

    let bulletsToShoot = [];

    if (viewMode === 'horizontal') {
      // Disparo horizontal: dos balas una arriba de la otra
      bulletsToShoot.push({
        x: left + 104,
        y: top + 65,
        sprite: bulletSprite,
        direction: 'right'
      });
      bulletsToShoot.push({
        x: left + 104,
        y: top + 75,
        sprite: bulletSprite,
        direction: 'right'
      });
    } else {
      // Disparo vertical: dos balas una al costado de la otra
      bulletsToShoot.push({
        x: left + 41,
        y: top + 102,
        sprite: bulletSprite,
        direction: 'down'
      });
      bulletsToShoot.push({
        x: left + 51,
        y: top + 102,
        sprite: bulletSprite,
        direction: 'down'
      });
    }

    setBullets(prev => [...prev, ...bulletsToShoot]);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameActive) return;
      setBullets(prev =>
        prev
          .map(b => ({
            ...b,
            x: b.direction === 'right' ? b.x + 10 : b.x,
            y: b.direction === 'down' ? b.y + 10 : b.y
            }))

          .filter(b =>
            (b.direction === 'right' && b.x < 820) || 
            (b.direction === 'down' && b.y < 520)     
          )
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return [bullets, setBullets, isGameActive];
}

export default useBullets;
