// src/hooks/player/usePlayerCollision.js
import { useEffect, useRef } from 'react';
import { getEnemyHitbox } from '../../utils/enemyHitbox';

/*
  Detecta colisiones entre el jugador, enemigos y balas enemigas.

  DISEÑO CLAVE:
  - isImmuneRef: ref sincrónico de useLives, nunca stale.
  - triggerDamageRef: guardamos triggerDamage en un ref para que el
    useEffect del loop rAF no necesite triggerDamage en sus deps.
    Sin esto, si triggerDamage cambiara de identidad entre renders,
    el loop se cancelaría y reiniciaría constantemente.
  - El loop de rAF solo depende de isGameActive para montarse/desmontarse.
    Enemies y bullets se leen desde refs actualizados en cada render.
*/
function usePlayerCollision(
  enemies,
  enemyBullets,
  planeRef,
  isGameActive,
  triggerDamage,
  isImmuneRef,
) {
  const animationRef    = useRef();
  const enemiesRef      = useRef(enemies);
  const enemyBulletsRef = useRef(enemyBullets);
  const triggerDamageRef = useRef(triggerDamage);

  // Mantener refs siempre actualizados
  useEffect(() => { enemiesRef.current      = enemies;       }, [enemies]);
  useEffect(() => { enemyBulletsRef.current = enemyBullets;  }, [enemyBullets]);
  useEffect(() => { triggerDamageRef.current = triggerDamage; }, [triggerDamage]);

  useEffect(() => {
    if (!isGameActive) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const checkCollision = () => {
      const plane = planeRef.current;
      if (!plane) {
        animationRef.current = requestAnimationFrame(checkCollision);
        return;
      }

      // Guard de inmunidad — sincrónico, nunca stale
      if (isImmuneRef.current) {
        animationRef.current = requestAnimationFrame(checkCollision);
        return;
      }

      const px = parseInt(plane.style.left || '100') + 24;
      const py = parseInt(plane.style.top  || '200') + 26;
      const pw = 52;
      const ph = 50;

      // Colisión con cuerpos de enemigos
      for (const enemy of enemiesRef.current) {
        const hitbox = getEnemyHitbox(enemy);
        if (!hitbox) continue;

        if (
          px      < hitbox.x + hitbox.width  &&
          px + pw > hitbox.x                 &&
          py      < hitbox.y + hitbox.height  &&
          py + ph > hitbox.y
        ) {
          triggerDamageRef.current();
          animationRef.current = requestAnimationFrame(checkCollision);
          return;
        }
      }

      // Colisión con balas enemigas
      for (const bullet of enemyBulletsRef.current) {
        const hitbox = getEnemyHitbox(bullet);
        if (!hitbox) continue;

        if (
          px      < hitbox.x + hitbox.width  &&
          px + pw > hitbox.x                 &&
          py      < hitbox.y + hitbox.height  &&
          py + ph > hitbox.y
        ) {
          triggerDamageRef.current();
          animationRef.current = requestAnimationFrame(checkCollision);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(checkCollision);
    };

    animationRef.current = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isGameActive]); // ← solo isGameActive: el loop nunca se reinicia innecesariamente
}

export default usePlayerCollision;