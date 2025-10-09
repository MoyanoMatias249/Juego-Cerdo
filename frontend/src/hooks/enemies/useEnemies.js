import { useEffect, useState } from 'react';
import { createBasicEnemy, updateBasicEnemy } from './useEnemiesBasic';

/*
  * Maneja el estado y movimiento de todos los enemigos activos.
*/
function useEnemies(isGameActive) {
  const [enemies, setEnemies] = useState([]);
  const [enemyPropellerFrame, setEnemyPropellerFrame] = useState(0);

  const updaterMap = {
    basic: updateBasicEnemy,
  };

  useEffect(() => {
    if (!isGameActive) return;
    let animationId;

    const animate = () => {
      setEnemies((prev) =>
        prev
          .map((e) => {
            const updater = updaterMap[e.type];
            return updater ? updater(e) : e;
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
    }
    setEnemies((prev) => [...prev, ...newEnemies]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyPropellerFrame((prev) => (prev + 1) % 2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return [enemies, setEnemies, spawnEnemies, enemyPropellerFrame];
}

export default useEnemies;
