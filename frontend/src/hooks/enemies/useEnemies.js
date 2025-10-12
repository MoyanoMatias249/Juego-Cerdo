import { useEffect, useState } from 'react';
import { createBasicEnemy, updateBasicEnemy } from './useEnemiesBasic';
import { createWolfEnemy, updateWolfEnemy } from './useEnemiesWolf';
import { createSharkEnemy, updateSharkEnemy } from './useEnemiesShark';
import { createBoatWolfEnemy, updateBoatWolfEnemy } from './useEnemiesBoatWolf';

/*
  * Maneja el estado y movimiento de todos los enemigos activos.
*/
function useEnemies(isGameActive, playerRef) {
  const [enemies, setEnemies] = useState([]);
  const [enemyPropellerFrame, setEnemyPropellerFrame] = useState(0);

  const updaterMap = {
    basic: updateBasicEnemy,
    wolf: updateWolfEnemy,
    shark: updateSharkEnemy,
   'boat-wolf': updateBoatWolfEnemy,
  };

  const getPlayerPosition = () => {
    const el = playerRef?.current;
    if (!el) return { x: 400, y: 250 }; // posición por defecto
    return {
      x: parseInt(el.style.left || '400'),
      y: parseInt(el.style.top || '250'),
    };
  };

  useEffect(() => {
    if (!isGameActive) return;
    let animationId;

    const animate = () => {
      const { x: playerX, y: playerY } = getPlayerPosition();
      setEnemies((prev) =>
        prev
          .map((e) => {
             const updater = updaterMap[e.type];
              return updater ? updater(e, playerX, playerY) : e;
          })
          .filter((e) => e !== null)
      );
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isGameActive]);

  const spawnEnemies = (type, count) => {
    const newEnemies = [];
    for (let i = 0; i < count; i++) {
      if (type === 'basic') newEnemies.push(createBasicEnemy());
      if (type === 'wolf') newEnemies.push(createWolfEnemy());
      if (type === 'shark') newEnemies.push(createSharkEnemy());
      if (type === 'boat-wolf') newEnemies.push(createBoatWolfEnemy());
    }
    setEnemies((prev) => [...prev, ...newEnemies]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyPropellerFrame((prev) => (prev + 1) % 2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return [enemies, setEnemies, spawnEnemies, enemyPropellerFrame, ];
}

export default useEnemies;
