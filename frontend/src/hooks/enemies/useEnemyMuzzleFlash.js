// src/hooks/enemies/useEnemyMuzzleFlash.js
import { useState, useEffect } from 'react';
import flash1 from '../../assets/sprites-player/explosion-bullet-side-1.png';
import flash2 from '../../assets/sprites-player/explosion-bullet-side-2.png';
import flash3 from '../../assets/sprites-player/explosion-bullet-side-3.png';

const frames = [flash1, flash2, flash3];

function useEnemyMuzzleFlash() {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    if (frame === null) return;

    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev + 1 >= frames.length) return null;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [frame]);

  const triggerFlash = () => setFrame(0);

  const currentSprite = frame === null ? null : frames[frame];

  return [currentSprite, triggerFlash];
}

export default useEnemyMuzzleFlash;
