import { useState } from 'react';

/*
  * Hook que gestiona las vidas del jugador y la inmunidad temporal tras recibir daño.
  * Si las vidas llegan a 0, se dispara la función de Game Over.
*/
function useLives(onGameOver, planeRef, triggerExplosion) {
  const [lives, setLives] = useState(6); // 3 corazones = 6 vidas
  const [isImmune, setIsImmune] = useState(false);
  const [blink, setBlink] = useState(false);

  /*
    * Aplica daño al jugador si no está en estado inmune.
    * Dispara una explosión en la posición del avión y reduce las vidas.
    * Activa parpadeo visual durante 2 segundos para indicar inmunidad.
  */
  const triggerDamage = () => {
    if (isImmune || lives <= 0) return;

    const plane = planeRef.current;
    if (plane) {
      const x = parseInt(plane.style.left || '100');
      const y = parseInt(plane.style.top || '200');
    }

    setLives((prev) => {
      const newLives = Math.max(prev - 1, 0);
      if (newLives === 0 && typeof onGameOver === 'function') {
        onGameOver();
      }
      return newLives;
    });

    setIsImmune(true);
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
      blinkCount++;
      if (blinkCount >= 8) {
        clearInterval(blinkInterval);
        setBlink(false);
        setIsImmune(false);
      }
    }, 250);
  };

  return { lives, setLives, isImmune, blink, triggerDamage };
}

export default useLives;
