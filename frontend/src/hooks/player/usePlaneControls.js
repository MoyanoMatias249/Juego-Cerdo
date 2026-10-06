// src/hooks/player/usePlaneControls.js
import { useEffect, useState } from 'react';

import planeSide     from '../../assets/sprites-player/red-plane-side.png';
import planeSideUp   from '../../assets/sprites-player/red-plane-side-up.png';
import planeSideDown from '../../assets/sprites-player/red-plane-side-down.png';
import planeTop      from '../../assets/sprites-player/red-plane-top.png';
import planeTopLeft  from '../../assets/sprites-player/red-plane-top-left.png';
import planeTopRight from '../../assets/sprites-player/red-plane-top-right.png';

function getDirections(keys) {
  return {
    up:    keys['KeyW'] || keys['ArrowUp'],
    down:  keys['KeyS'] || keys['ArrowDown'],
    left:  keys['KeyA'] || keys['ArrowLeft'],
    right: keys['KeyD'] || keys['ArrowRight'],
  };
}

/*
  isBlocked: true cuando el juego está pausado o en game over.
  Al estar bloqueado:
    - No se registran nuevas teclas.
    - El loop de movimiento rAF no se ejecuta → el avión se congela.
    - Las keys se limpian para que al reanudar no haya teclas "fantasma".
*/
function usePlaneControls(planeRef, viewMode, isBlocked = false) {
  const [keys,          setKeys]          = useState({});
  const [planeImage,    setPlaneImage]    = useState(viewMode === 'horizontal' ? planeSide : planeTop);
  const [propellerFrame, setPropellerFrame] = useState(0);

  // Registrar teclas — solo cuando no está bloqueado
  useEffect(() => {
    if (isBlocked) return;

    const down = (e) => {
      if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        e.preventDefault();
      }
      setKeys(prev => ({ ...prev, [e.code]: true }));
    };
    const up = (e) => setKeys(prev => ({ ...prev, [e.code]: false }));

    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup',   up);
    };
  }, [isBlocked]);

  // Limpiar keys al bloquearse — evita teclas "fantasma" al reanudar
  useEffect(() => {
    if (isBlocked) setKeys({});
  }, [isBlocked]);

  // Loop de movimiento vía rAF — se desmonta cuando isBlocked cambia a true
  useEffect(() => {
    if (isBlocked) return; // ← no corre el loop si está bloqueado

    let animationId;
    const move = () => {
      const plane = planeRef.current;
      if (!plane) { animationId = requestAnimationFrame(move); return; }

      const left = parseInt(plane.style.left || '100');
      const top  = parseInt(plane.style.top  || '200');
      const dir  = getDirections(keys);
      const speed = 6.5;

      let newLeft = left;
      let newTop  = top;

      if (dir.left  && left > 0)            newLeft -= speed;
      if (dir.right && left < 800 - 98)     newLeft += speed;
      if (dir.up    && top > -20)            newTop  -= speed;
      if (dir.down  && top < 500 - 96 - 20) newTop  += speed;

      plane.style.left = `${newLeft}px`;
      plane.style.top  = `${newTop}px`;

      let newPlaneImage;
      if (viewMode === 'horizontal') {
        if (dir.up)        newPlaneImage = planeSideUp;
        else if (dir.down) newPlaneImage = planeSideDown;
        else               newPlaneImage = planeSide;
      } else {
        if (dir.left)       newPlaneImage = planeTopLeft;
        else if (dir.right) newPlaneImage = planeTopRight;
        else                newPlaneImage = planeTop;
      }

      setPlaneImage(newPlaneImage);
      animationId = requestAnimationFrame(move);
    };

    animationId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationId);
  }, [keys, viewMode, isBlocked]); // ← isBlocked en deps: se desmonta al pausar

  // Animación de hélice
  useEffect(() => {
    const interval = setInterval(() => {
      setPropellerFrame(prev => (prev + 1) % 6);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return { keys, planeImage, propellerFrame };
}

export default usePlaneControls;