import EnemyBasic from './EnemyBasic';
import EnemyWolf from './EnemyWolf-1';
import EnemyShark from './EnemyShark';
import EnemyBoatWolf from './EnemyWolf-2';

function Enemies({ enemies, enemyPropellerFrame, showHitboxes }) {
  return (
    <>
      {enemies.map((enemy) => {
        if (enemy.type === 'basic') {
          return (
            <EnemyBasic
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              propellerFrame={enemyPropellerFrame}
              rotation={enemy.rotation}
              showHitboxes={showHitboxes}
              hitTimestamp={enemy.hitTimestamp}
            />
          );
        }
        if (enemy.type === 'wolf') {
          return (
            <EnemyWolf
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              direction={enemy.direction}
              propellerFrame={enemyPropellerFrame}
              showHitboxes={showHitboxes}
              hitTimestamp={enemy.hitTimestamp}
            />
          );
        }
        if (enemy.type === 'shark') {
          return (
            <EnemyShark
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              state={enemy.state}
              showHitboxes={showHitboxes}
              hitTimestamp={enemy.hitTimestamp}
            />
          );
        }

        if (enemy.type === 'boat-wolf') {
          return (
            <EnemyBoatWolf
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              direction={enemy.direction}
              showHitboxes={showHitboxes}
              hitTimestamp={enemy.hitTimestamp}
              shoot={enemy.shoot}
            />
          );
        }

        {enemy.justDied && (
          <div
            key={`death-${enemy.id}`}
            style={{
              position: 'absolute',
              left: enemy.x,
              top: enemy.y,
              width: '80px',
              height: '80px',
              backgroundColor: 'white',
              opacity: 0.8,
              zIndex: 3,
            }}
          />
        )}
        return null;
      })}
    </>
  );
}

export default Enemies;
