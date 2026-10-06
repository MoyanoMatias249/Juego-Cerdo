import { useEffect, useState } from 'react';
import pirateFlag1 from '../../assets/sprites-background/pirate-flag-1.png';
import pirateFlag2 from '../../assets/sprites-background/pirate-flag-2.png';
const flagFrames = [pirateFlag1, pirateFlag2];

function PirateFlag({ isGameActive, resetTrigger }) {
  const [x, setX] = useState(820);
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);

  // Movimiento constante: 1px cada 16ms
  useEffect(() => {
    if (!isGameActive || !visible) return;

    const interval = setInterval(() => {
      setX(prev => {
        const next = prev - 3;
        if (next < -120) setVisible(false);
        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isGameActive, visible]);

  // Reinicio al reset
  useEffect(() => {
    setX(820);
    setVisible(true);
  }, [resetTrigger]);

  // Animación de frames
  useEffect(() => {
    if (!isGameActive || !visible) return;

    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % flagFrames.length);
    }, 200);
    return () => clearInterval(interval);
  }, [isGameActive, visible]);

  if (!visible) return null;

  return (
    <img
      src={flagFrames[frame]}
      alt="Pirate Flag"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: '230px',
        width: '105px',
        height: '230px',
        imageRendering: 'pixelated',
        zIndex: 3
      }}
    />
  );
}

export default PirateFlag;
