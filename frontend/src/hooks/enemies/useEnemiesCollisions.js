import { useEffect, useRef } from 'react';
import { getEnemyHitbox } from '../../utils/enemyHitbox';

/*
  Detecta colisiones entre balas del jugador y enemigos.
  Aplica daño, elimina enemigos si su vida llega a 0,
  dispara la animación de humo y el sonido de muerte en la posición correcta,
  elimina balas no perforantes al impactar,
  y notifica el daño total al sistema de bonus-heart via registerDamage.
*/
function useEnemiesCollisions(
  bullets,
  enemies,
  setBullets,
  setEnemies,
  isGameActive,
  setScore,
  triggerDeathAnim,
  playEnemyDeath,
) {
  const animationRef = useRef();

  useEffect(() => {
    if (!isGameActive) return;

    const checkCollisions = () => {
      const collidedBullets = new Set();
      const damageMap       = new Map();

      bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
          const hitbox = getEnemyHitbox(e);
          if (!hitbox) return;

          const overlap =
            b.x      < hitbox.x + hitbox.width  &&
            b.x + 8  > hitbox.x                 &&
            b.y      < hitbox.y + hitbox.height  &&
            b.y + 8  > hitbox.y;

          if (overlap) {
            if (b.hitEnemies?.has(ei)) return;
            b.hitEnemies?.add(ei);

            const current = damageMap.get(ei) || 0;
            damageMap.set(ei, current + (b.damage || 1));

            if (!b.piercing) collidedBullets.add(bi);
          }
        });
      });

      setEnemies((prev) => {
        const updated = [];

        prev.forEach((e, i) => {
          const damage    = damageMap.get(i) || 0;
          const newHealth = e.health - damage;

          if (newHealth <= 0) {
            const hitbox  = getEnemyHitbox(e);
            const centerX = hitbox ? hitbox.x + hitbox.width  / 2 : e.x + 20;
            const centerY = hitbox ? hitbox.y + hitbox.height / 2 : e.y + 14;

            triggerDeathAnim?.(centerX, centerY);
            playEnemyDeath?.();

            if (typeof e.points === 'number') {
              setScore(prev => prev + e.points);
            }

            return;
          }

          updated.push({
            ...e,
            health:       newHealth,
            hitTimestamp: damage > 0 ? Date.now() : e.hitTimestamp,
          });
        });

        return updated;
      });

      setBullets(prev => prev.filter((_, i) => !collidedBullets.has(i)));

      animationRef.current = requestAnimationFrame(checkCollisions);
    };

    animationRef.current = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationRef.current);
  }, [bullets, enemies, isGameActive]);
}

export default useEnemiesCollisions;