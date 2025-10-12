// src/hooks/enemies/useEnemyBullets.js
import { useEffect, useState } from 'react';

function useEnemyBullets(enemies) {
  const [enemyBullets, setEnemyBullets] = useState([]);

  useEffect(() => {
    const newBullets = [];

    enemies.forEach((e) => {
      if (!e.shoot) return;

      // 🛶 Lobo en bote
      if (e.type === 'boat-wolf' && e.targetX !== undefined && e.targetY !== undefined) {
        const dx = e.targetX - e.x;
        const dy = e.targetY - e.y;
        const angle = Math.atan2(dy, dx);
        const speed = 4;

        newBullets.push({
          x: e.x + 45 + 6, // centro horizontal del cañón
          y: e.y + 4 + 6,  // centro vertical del cañón,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'cannonball',
        });
      }

      else if (e.type === 'wolf') {
        newBullets.push({
          x: e.x + 25,
          y: e.y + 60 + Math.random() * 10,
          vx: 0,
          vy: 6,
          type: 'basic',
        });
      }
    });

    if (newBullets.length > 0) {
      setEnemyBullets((prev) => [...prev, ...newBullets]);
    }
  }, [enemies]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + (b.vx ?? 0),
            y: b.y + b.vy,
          }))
          .filter((b) => b.y < 700 && b.x > -100 && b.x < 900)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return [enemyBullets, setEnemyBullets];
}

export default useEnemyBullets;
