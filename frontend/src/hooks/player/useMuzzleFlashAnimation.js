import { useState, useEffect } from 'react';

import flashFront1 from '../../assets/sprites-player/explosion-bullet-front-1.png';
import flashFront2 from '../../assets/sprites-player/explosion-bullet-front-2.png';
import flashFront3 from '../../assets/sprites-player/explosion-bullet-front-3.png';

import flashSide1 from '../../assets/sprites-player/explosion-bullet-side-1.png';
import flashSide2 from '../../assets/sprites-player/explosion-bullet-side-2.png';
import flashSide3 from '../../assets/sprites-player/explosion-bullet-side-3.png';

const flashFront = [flashFront1, flashFront2, flashFront3];
const flashSide = [flashSide1, flashSide2, flashSide3];

function useMuzzleFlashAnimation(viewMode) {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    if (frame === null) return;

    const maxFrames = viewMode === 'horizontal' ? flashSide.length : flashFront.length;
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev + 1 >= maxFrames) return null;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [frame, viewMode]);

  const triggerFlash = () => {
    setFrame(0);
  };

  const currentSprite =
    frame === null
      ? null
      : viewMode === 'horizontal'
      ? flashSide[frame]
      : flashFront[frame];

  return [currentSprite, triggerFlash];
}

export default useMuzzleFlashAnimation;
