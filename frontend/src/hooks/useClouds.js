import { useEffect, useState, useRef } from 'react';
import cloud1 from '../assets/sprites-background/cloud-1.png';
import cloud2 from '../assets/sprites-background/cloud-2.png';
import cloud3 from '../assets/sprites-background/cloud-3.png';
import cloud4 from '../assets/sprites-background/cloud-4.png';

const cloudSprites = [cloud1, cloud2, cloud3, cloud4];

function useClouds() {
  const [clouds, setClouds] = useState([]);
  const timeoutRef = useRef(null);
  const animationRef = useRef(null);
  const isPausedRef = useRef(false); // control externo

  // Inicialización de nubes al montar
  useEffect(() => {
    const initialClouds = [];
    const count = 5 + Math.floor(Math.random() * 6);
    const minVerticalGap = 100;

    let attempts = 0;
    while (initialClouds.length < count && attempts < 30) {
      attempts++;
      const y = Math.random() * 250;
      const tooClose = initialClouds.some(c => Math.abs(c.y - y) < minVerticalGap);
      if (tooClose) continue;

      const whichCloud = Math.floor(Math.random() * cloudSprites.length);
      const x = Math.random() * 800;

      initialClouds.push({
        x,
        y,
        sprite: cloudSprites[whichCloud],
        speed: 0.3 + Math.random() * 0.2,
        id: Math.random().toString(36).slice(2),
      });
    }

    setClouds(initialClouds);
  }, []);

  // Generación de nuevas nubes
  useEffect(() => {
    const spawnCycle = () => {
      if (isPausedRef.current) {
        timeoutRef.current = setTimeout(spawnCycle, 1000);
        return;
      }

      const newClouds = [];
      const maxPerCycle = 1;
      const minVerticalGap = 180;
      const maxAttempts = 10;

      let attempts = 0;
      while (newClouds.length < maxPerCycle && attempts < maxAttempts) {
        attempts++;
        const y = 50 + Math.random() * 230; // entre 50 y 280
        const tooCloseToExisting = clouds.some(c => Math.abs(c.y - y) < minVerticalGap);
        const tooCloseToNew = newClouds.some(c => Math.abs(c.y - y) < minVerticalGap);
        if (tooCloseToExisting || tooCloseToNew) continue;

        const whichCloud = Math.floor(Math.random() * cloudSprites.length);
        newClouds.push({
          x: 820,
          y,
          sprite: cloudSprites[whichCloud],
          speed: 0.3 + Math.random() * 0.2,
          id: Math.random().toString(36).slice(2),
        });
      }

      if (newClouds.length > 0) {
        setClouds(prev => [...prev, ...newClouds]);
      }

      const nextDelay = 8000 + Math.random() * 8000; // entre 8s y 16s
      timeoutRef.current = setTimeout(spawnCycle, nextDelay);
    };

    timeoutRef.current = setTimeout(spawnCycle, 1000);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Movimiento continuo
  useEffect(() => {
    const animate = () => {
      if (!isPausedRef.current) {
        setClouds(prev =>
          prev.map(c => ({ ...c, x: c.x - c.speed })).filter(c => c.x > -200)
        );
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return [clouds, setClouds, isPausedRef];
}

export default useClouds;
