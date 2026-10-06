// src/hooks/enemies/useEnemies.js
import { useEffect, useState } from 'react';
import { createBasicEnemy,      updateBasicEnemy      } from './useEnemiesBasic';
import { createWolfEnemy,       updateWolfEnemy       } from './useEnemiesWolf';
import { createSharkEnemy,      updateSharkEnemy      } from './useEnemiesShark';
import { createBoatWolfEnemy,   updateBoatWolfEnemy   } from './useEnemiesBoatWolf';
import { createShipWolfBoss,    updateShipWolfBoss    } from './useEnemiesShipWolf';
import { createBulletWolfEnemy, updateBulletWolfEnemy } from './useEnemiesBulletWolf';
import { createRedSharkEnemy,   updateRedSharkEnemy   } from './useEnemiesRedShark';
import { createAirShipBoss,     updateAirShipBoss     } from './useEnemiesAirShipBoss';

function useEnemies(isGameActive, playerRef) {
  const [enemies,             setEnemies]             = useState([]);
  const [enemyPropellerFrame, setEnemyPropellerFrame] = useState(0);

  const updaterMap = {
    basic:         updateBasicEnemy,
    wolf:          updateWolfEnemy,
    shark:         updateSharkEnemy,
    'boat-wolf':   updateBoatWolfEnemy,
    'ship-wolf':   updateShipWolfBoss,
    'bullet-wolf': updateBulletWolfEnemy,
    'red-shark':   updateRedSharkEnemy,
    'air-ship':    updateAirShipBoss,
  };

  const getPlayerPosition = () => {
    const el = playerRef?.current;
    if (!el) return { x: 400, y: 250 };
    return {
      x: parseInt(el.style.left || '400'),
      y: parseInt(el.style.top  || '250'),
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
      if (type === 'basic')       newEnemies.push(createBasicEnemy());
      if (type === 'wolf')        newEnemies.push(createWolfEnemy());
      if (type === 'shark')       newEnemies.push(createSharkEnemy());
      if (type === 'boat-wolf')   newEnemies.push(createBoatWolfEnemy());
      if (type === 'ship-wolf')   newEnemies.push(createShipWolfBoss());
      if (type === 'bullet-wolf') newEnemies.push(createBulletWolfEnemy());
      if (type === 'red-shark')   newEnemies.push(createRedSharkEnemy());
      if (type === 'air-ship')    newEnemies.push(createAirShipBoss());
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