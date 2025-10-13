// src/components/Background.jsx

import { useEffect, useState } from 'react';
import sky from '../assets/sprites-background/sky-1.png';
import water from '../assets/sprites-background/water-1.png';
import waterOverlay from '../assets/sprites-background/water-2.png';
import sun from '../assets/sprites-background/sun-1.png';
import controlsImage from '../assets/sprites-ui/controls.png';

function Background({ isGameActive }) {
  const [skyPos, setSkyPos] = useState([0, 800]);
  const [waterPos, setWaterPos] = useState([0, 800]);
  const [sunX, setSunX] = useState(730);
  const [waterOverlayPos, setWaterOverlayPos] = useState([0, 800]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!isGameActive) return;
    const interval = setInterval(() => {
      setSkyPos(([a, b]) => {
        const newA = a - 1;
        const newB = b - 1;
        return [
          newA <= -800 ? newB + 800 : newA,
          newB <= -800 ? newA + 800 : newB
        ];
      });

      setWaterPos(([a, b]) => {
        const newA = a - 2.5;
        const newB = b - 2.5;
        return [
          newA <= -800 ? newB + 800 : newA,
          newB <= -800 ? newA + 800 : newB
        ];
      });

      setSunX(prev => (prev <= -61 ? 730 : prev - 0.01));

      setWaterOverlayPos(([a, b]) => {
        const newA = a - 2;
        const newB = b - 2;
        return [
          newA <= -800 ? newB + 800 : newA,
          newB <= -800 ? newA + 800 : newB
        ];
      });
    }, 16);
    return () => clearInterval(interval);
  }, [isGameActive]);

  useEffect(() => {
  const fadeTimeout = setTimeout(() => {
    setShowIntro(false); // oculta completamente después del fade
  }, 5500); // 4s visible + 1.5s fade

  return () => clearTimeout(fadeTimeout);
}, []);

  return (
    <>
      <div className="background-wrapper">
        {/* Sol */}
        <img src={sun} className="sun" alt="sun" style={{ left: `${sunX}px` }} />

        {/* Cielo */}
        <img src={sky} className="sky" alt="sky" style={{ left: `${skyPos[0]}px` }} />
        <img src={sky} className="sky flipped" alt="sky" style={{ left: `${skyPos[1]}px` }} />

        {/* Agua */}
        <img src={water} className="water" alt="water" style={{ left: `${waterPos[0]}px` }} />
        <img src={water} className="water flipped" alt="water" style={{ left: `${waterPos[1]}px` }} />
      </div>

      {showIntro && (
        <img
          src={controlsImage}
          alt="Controles"
          className={`controls-intro ${!isGameActive ? '' : 'fade-out'}`}
        />
      )}

      <div className="background-overlay">
        {/* Agua oscura por encima */}
        <img src={waterOverlay} className="water-overlay" style={{ left: `${waterOverlayPos[0]}px` }} />
        <img src={waterOverlay} className="water-overlay flipped" style={{ left: `${waterOverlayPos[1]}px` }} />
      </div>
    </>
  );
}

export default Background;
