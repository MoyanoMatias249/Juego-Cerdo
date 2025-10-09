import planeSprite from "../../assets/sprites-enemies/enemiesBasic-side.png";
import propeller1 from '../../assets/sprites-player/propeller-side-1.png';
import propeller2 from '../../assets/sprites-player/propeller-side-2.png';
import propeller3 from '../../assets/sprites-player/propeller-side-3.png';
import propeller4 from '../../assets/sprites-player/propeller-side-4.png';
import propeller5 from '../../assets/sprites-player/propeller-side-5.png';
import propeller6 from '../../assets/sprites-player/propeller-side-6.png';


const propellers = [propeller1, propeller2, propeller3, propeller4, propeller5, propeller6];

function EnemyBasic({ x, y, propellerFrame, rotation = 0, showHitboxes }) {
  return (
    <div
      className="enemy-wrapper"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '102px',
        height: '44px',
        zIndex: 5,
        transform: `scaleX(-1) rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      <img
        src={planeSprite}
        alt="enemy"
        style={{
          position: 'absolute',
          width: '102px',
          height: '44px',
        }}
      />
      <img
        src={propellers[propellerFrame]}
        alt="propeller"
        style={{
          position: 'absolute',
          left: '98px',
          top: '14px',
          width: '8px',
          height: '24px',
        }}
        
      />

      {/* Hitbox visible para testeo */}
      {showHitboxes && (
        <div
          className="enemy-hitbox"
          style={{
            position: 'absolute',
            left: '0px',
            top: '10px',
            width: '100px',
            height: '30px',
            border: '2px dashed red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}


export default EnemyBasic;
