// src/hooks/useDeathAnimations.js
import { useState, useCallback, useRef } from 'react';

/*
  Maneja las animaciones de humo que aparecen cuando muere un enemigo.

  Cada animación tiene:
    - id: único para usarse como key en React
    - x, y: posición donde murió el enemigo
    - frame: frame actual (0-3)
    - done: si ya terminó (para filtrarla)

  La animación corre a 8 FPS → un frame cada 125ms.
  Son 4 frames → dura 500ms en total.
*/

let deathAnimIdCounter = 0;
const nextDeathAnimId = () => `da-${++deathAnimIdCounter}`;

function useDeathAnimations() {
  const [deathAnims, setDeathAnims] = useState([]);
  const timersRef = useRef([]);

  const triggerDeathAnim = useCallback((x, y) => {
    const id = nextDeathAnimId();

    setDeathAnims(prev => [
      ...prev,
      { id, x, y, frame: 0 },
    ]);

    // Avanzar frames a 8 FPS (125ms por frame)
    // Frame 0 ya está puesto arriba — avanzamos a 1, 2, 3 y luego eliminamos
    [1, 2, 3].forEach((frame) => {
      const t = setTimeout(() => {
        setDeathAnims(prev =>
          prev.map(a => a.id === id ? { ...a, frame } : a)
        );
      }, frame * 125);
      timersRef.current.push(t);
    });

    // Eliminar la animación al terminar (después del frame 3)
    const cleanup = setTimeout(() => {
      setDeathAnims(prev => prev.filter(a => a.id !== id));
    }, 4 * 125); // 500ms
    timersRef.current.push(cleanup);

  }, []);

  // Para limpiar todos los timers pendientes al resetear el juego
  const clearDeathAnims = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setDeathAnims([]);
  }, []);

  return { deathAnims, triggerDeathAnim, clearDeathAnims };
}

export default useDeathAnimations;