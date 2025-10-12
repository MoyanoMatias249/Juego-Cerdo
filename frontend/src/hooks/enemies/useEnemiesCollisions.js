import { useEffect, useRef } from 'react';
import { getEnemyHitbox } from '../../utils/enemyHitbox';

/*
  * Detecta colisiones entre balas del jugador y enemigos.
  * Aplica daño, elimina enemigos si su vida llega a 0,
  * y elimina balas no perforantes al impactar.
*/
function useEnemiesCollisions(bullets, enemies, setBullets, setEnemies, isGameActive, setScore) {
  const animationRef = useRef();

  useEffect(() => {
    if (!isGameActive) return;

    const checkCollisions = () => {
      const collidedBullets = new Set();
      const damageMap = new Map();

      bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
          const hitbox = getEnemyHitbox(e);
          if (!hitbox) return;

          const bulletX = b.x;
          const bulletY = b.y;

          const overlap =
            bulletX < hitbox.x + hitbox.width &&
            bulletX + 8 > hitbox.x &&
            bulletY < hitbox.y + hitbox.height &&
            bulletY + 8 > hitbox.y;

          if (overlap) {
            if (b.hitEnemies?.has(ei)) return;

            b.hitEnemies?.add(ei);
            const currentDamage = damageMap.get(ei) || 0;
            damageMap.set(ei, currentDamage + (b.damage || 1));

            if (!b.piercing) {
              collidedBullets.add(bi);
            }
          }
        });
      });

      // Aplicar daño sin romper referencias
      setEnemies((prev) => {
        const updated = [];
        prev.forEach((e, i) => {
          const damage = damageMap.get(i) || 0;
          const newHealth = e.health - damage;

          if (newHealth <= 0) {
            if (typeof e.points === 'number') {
              setScore((prevScore) => prevScore + e.points); // ✅ suma puntos
            }
            return; // eliminar enemigo
          }

          updated.push({
            ...e,
            health: newHealth,
            hitTimestamp: damage > 0 ? Date.now() : e.hitTimestamp,
          });
        });

        return updated;
      });


      // Eliminar balas no perforantes
      setBullets((prev) => prev.filter((_, i) => !collidedBullets.has(i)));

      animationRef.current = requestAnimationFrame(checkCollisions);
    };

    animationRef.current = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationRef.current);
  }, [bullets, enemies, isGameActive]);
}

export default useEnemiesCollisions;
