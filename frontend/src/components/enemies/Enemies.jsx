import EnemyBasic from './EnemyBasic';

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
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default Enemies;
