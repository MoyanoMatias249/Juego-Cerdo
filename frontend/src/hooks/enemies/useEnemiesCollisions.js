import { useEffect, useRef } from 'react';

/*
  * Detecta colisiones entre balas del jugador y enemigos.
  * Elimina enemigos si su vida llega a 0.
*/
function useEnemiesCollisions(bullets, enemies, setBullets, setEnemies, isGameActive) {
  const animationRef = useRef();

  useEffect(() => {
    if (!isGameActive) return;
    const checkCollisions = () => {
      const collidedBullets = new Set();
      const collidedEnemies = new Set();

      bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
          // Hitbox manual del enemigo
          const hitbox = {
            x: e.x + 0,     // left offset
            y: e.y + 10,    // top offset
            width: 100,
            height: 30,
          };

          const bulletX = b.x;
          const bulletY = b.y;

          const overlap =
            bulletX < hitbox.x + hitbox.width &&
            bulletX + 8 > hitbox.x && // ancho de la bala
            bulletY < hitbox.y + hitbox.height &&
            bulletY + 8 > hitbox.y;  // alto de la bala

          if (overlap) {
            collidedBullets.add(bi);
            collidedEnemies.add(ei);
          }
        });
      });

      if (collidedBullets.size > 0 || collidedEnemies.size > 0) {
        setBullets((prev) => prev.filter((_, i) => !collidedBullets.has(i)));
        setEnemies((prev) => prev.filter((_, i) => !collidedEnemies.has(i)));
      }

      animationRef.current = requestAnimationFrame(checkCollisions);
    };

    animationRef.current = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationRef.current);
  }, [bullets, enemies, isGameActive]);
}

export default useEnemiesCollisions;
