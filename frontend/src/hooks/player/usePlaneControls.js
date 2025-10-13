import { useEffect, useState } from 'react';

import planeSide from '../../assets/sprites-player/plane-side.png';
import planeSideUp from '../../assets/sprites-player/plane-side-up.png';
import planeSideDown from '../../assets/sprites-player/plane-side-down.png';
import planeTop from '../../assets/sprites-player/plane-top.png';
import planeTopLeft from '../../assets/sprites-player/plane-top-left.png';
import planeTopRight from '../../assets/sprites-player/plane-top-right.png';

import planeSide2 from '../../assets/sprites-player/plane-side-new.png';
import planeSideUp2 from '../../assets/sprites-player/plane-side-new-up.png';
import planeSideDown2 from '../../assets/sprites-player/plane-side-new-down.png';
import planeTop2 from '../../assets/sprites-player/plane-top-new.png';
import planeTopLeft2 from '../../assets/sprites-player/plane-top-new-left.png';
import planeTopRight2 from '../../assets/sprites-player/plane-top-new-right.png';

function usePlaneControls(planeRef, viewMode, isBlocked = false, useAltSkin = false) {
  const [keys, setKeys] = useState({});
  const [planeImage, setPlaneImage] = useState(viewMode === 'horizontal' ? planeSide : planeTop);
  const [propellerFrame, setPropellerFrame] = useState(0);

  useEffect(() => {
    if (isBlocked) return;

    const down = (e) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const up = (e) => setKeys(prev => ({ ...prev, [e.code]: false }));
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [isBlocked]);

  useEffect(() => {
    if (isBlocked) return;

    let animationId;
    const move = () => {
      const plane = planeRef.current;
      if (!plane) return;

      const left = parseInt(plane.style.left || '100');
      const top = parseInt(plane.style.top || '200');

      let newLeft = left;
      let newTop = top;

      const speed = 6;

      if (keys.ArrowLeft && left > 0) newLeft -= speed;
      if (keys.ArrowRight && left < 800 - 98) newLeft += speed;
      if (keys.ArrowUp && top > -20) newTop -= speed;
      if (keys.ArrowDown && top < 500 - 96 - 20) newTop += speed;

      plane.style.left = `${newLeft}px`;
      plane.style.top = `${newTop}px`;

      let newPlaneImage;

      if (viewMode === 'horizontal') {
        if (keys.ArrowUp) newPlaneImage = useAltSkin ? planeSideUp2 : planeSideUp;
        else if (keys.ArrowDown) newPlaneImage = useAltSkin ? planeSideDown2 : planeSideDown;
        else newPlaneImage = useAltSkin ? planeSide2 : planeSide;
      } else {
        if (keys.ArrowLeft) newPlaneImage = useAltSkin ? planeTopLeft2 : planeTopLeft;
        else if (keys.ArrowRight) newPlaneImage = useAltSkin ? planeTopRight2 : planeTopRight;
        else newPlaneImage = useAltSkin ? planeTop2 : planeTop;
      }


      setPlaneImage(newPlaneImage);

      animationId = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(animationId);
  }, [keys, viewMode, isBlocked]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPropellerFrame(prev => (prev + 1) % 6);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isBlocked) {
      setKeys({}); // limpia teclas activas
    }
  }, [isBlocked]);

  return {
    keys,
    planeImage,
    propellerFrame
  };
}

export default usePlaneControls;
