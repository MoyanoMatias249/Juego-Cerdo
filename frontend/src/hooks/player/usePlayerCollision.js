import { useEffect, useRef, useState } from 'react';
import { getEnemyHitbox } from '../../utils/enemyHitbox';

/*
  * Detecta colisiones entre el avión del jugador y enemigos.
  * Aplica daño si hay contacto y el jugador no está inmune.
*/
function usePlayerCollision(enemies, enemyBullets, planeRef, isGameActive, triggerDamage) {
  const animationRef = useRef();

  useEffect(() => {
    if (!isGameActive) return;

    const checkCollision = () => {
      let damagedThisFrame = false;
      const plane = planeRef.current;
      if (!plane) return;

      const px = parseInt(plane.style.left || '100') + 16;
      const py = parseInt(plane.style.top || '200') + 16;
      const pw = 66;
      const ph = 66;

      enemies.forEach((enemy) => {
        if (damagedThisFrame) return;

        const hitbox = getEnemyHitbox(enemy);
        if (!hitbox) return;

        const overlap =
          px < hitbox.x + hitbox.width &&
          px + pw > hitbox.x &&
          py < hitbox.y + hitbox.height &&
          py + ph > hitbox.y;

        if (overlap) {
          triggerDamage();
          damagedThisFrame = true;
        }
      });

      enemyBullets.forEach((bullet) => {
        if (damagedThisFrame) return;

        const hitbox = getEnemyHitbox(bullet);
        if (!hitbox) return;

        const overlap =
          px < hitbox.x + hitbox.width &&
          px + pw > hitbox.x &&
          py < hitbox.y + hitbox.height &&
          py + ph > hitbox.y;

        if (overlap) {
          triggerDamage();
          damagedThisFrame = true;
        }
      });

    animationRef.current = requestAnimationFrame(checkCollision);
  };

    animationRef.current = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(animationRef.current);
  }, [enemies, isGameActive, planeRef, triggerDamage]);
}

export default usePlayerCollision;
