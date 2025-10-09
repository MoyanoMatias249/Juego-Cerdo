import { useEffect, useRef } from 'react';

/*
  * Hook que detecta colisiones entre el avión del jugador y elementos decorativos (como nubes).
  * Muestra el área de colisión visualmente para testeo.
*/
function usePlayerCollision(clouds, planeRef, isGameActive) {
  const animationRef = useRef();

  useEffect(() => {
    if (!isGameActive) return;

    const checkCollision = () => {
      const plane = planeRef.current;
      if (!plane) return;

      const px = parseInt(plane.style.left || '100') + 14;
      const py = parseInt(plane.style.top || '200') + 20;
      const pw = 70;
      const ph = 70;

      clouds.forEach((cloud) => {
        const overlap =
          px < cloud.x + 120 &&
          px + pw > cloud.x &&
          py < cloud.y + 40 &&
          py + ph > cloud.y;

        if (overlap) {
          console.log('💥 Colisión con nube:', cloud.id);
        }
      });

      animationRef.current = requestAnimationFrame(checkCollision);
    };

    animationRef.current = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(animationRef.current);
  }, [clouds, isGameActive, planeRef]);
}

export default usePlayerCollision;
