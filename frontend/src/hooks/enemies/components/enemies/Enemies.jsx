// src/components/enemies/Enemies.jsx
import EnemyBasic        from './EnemyBasic';
import EnemyWolf         from './EnemyWolf-1';
import EnemyShark        from './EnemyShark';
import EnemyBoatWolf     from './EnemyWolf-2';
import EnemyShipWolf     from './EnemyBossWolf';
import EnemyBulletWolf   from './EnemyBulletWolf';
import EnemyRedShark     from './EnemyRedShark';
import EnemyAirShipBoss  from './EnemyAirShipBoss';

const ENEMY_COMPONENTS = {
  'basic':       EnemyBasic,
  'wolf':        EnemyWolf,
  'shark':       EnemyShark,
  'boat-wolf':   EnemyBoatWolf,
  'ship-wolf':   EnemyShipWolf,
  'bullet-wolf': EnemyBulletWolf,
  'red-shark':   EnemyRedShark,
  'air-ship':    EnemyAirShipBoss,
};

const EXTRA_PROPS = {
  'basic':       (e, frame) => ({ propellerFrame: frame, rotation: e.rotation }),
  'wolf':        (e, frame) => ({ direction: e.direction, propellerFrame: frame }),
  'shark':       (e)        => ({ state: e.state }),
  'boat-wolf':   (e)        => ({ direction: e.direction, shoot: e.shoot }),
  'ship-wolf':   (e)        => ({ heads: e.heads, shoot: e.shoot }),
  'bullet-wolf': (e, frame) => ({ direction: e.direction, propellerFrame: frame }),
  'red-shark':   (e)        => ({ state: e.state, rotation: e.rotation }),
  'air-ship':    (e)        => ({
    wolf2Gone:  e.wolf2Gone,
    shipFrame:  e.shipFrame,
    propFrame:  e.propFrame,
    shoot:      e.shoot,
    phase:      e.phase,
  }),
};

function Enemies({ enemies, enemyPropellerFrame, showHitboxes }) {
  return (
    <>
      {enemies.map((enemy) => {
        const EnemyComponent = ENEMY_COMPONENTS[enemy.type];
        if (!EnemyComponent) return null;

        const extra = EXTRA_PROPS[enemy.type]?.(enemy, enemyPropellerFrame) ?? {};

        return (
          <EnemyComponent
            key={enemy.id}
            x={enemy.x}
            y={enemy.y}
            showHitboxes={showHitboxes}
            hitTimestamp={enemy.hitTimestamp}
            {...extra}
          />
        );
      })}
    </>
  );
}

export default Enemies;
