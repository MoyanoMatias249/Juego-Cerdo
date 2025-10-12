// src/components/Player.jsx

import pigFront1 from '../assets/sprites-player/pig-front-1.png';
import pigFront2 from '../assets/sprites-player/pig-front-2.png';
import pigFront3 from '../assets/sprites-player/pig-front-3.png';
import pigSide1 from '../assets/sprites-player/pig-side-1.png';
import pigSide2 from '../assets/sprites-player/pig-side-2.png';
import pigSide3 from '../assets/sprites-player/pig-side-3.png';


import propellerSide1 from '../assets/sprites-player/propeller-side-1.png';
import propellerSide2 from '../assets/sprites-player/propeller-side-2.png';
import propellerSide3 from '../assets/sprites-player/propeller-side-3.png';
import propellerSide4 from '../assets/sprites-player/propeller-side-4.png';
import propellerSide5 from '../assets/sprites-player/propeller-side-5.png';
import propellerSide6 from '../assets/sprites-player/propeller-side-6.png';

import propellerTop1 from '../assets/sprites-player/propeller-front-1.png';
import propellerTop2 from '../assets/sprites-player/propeller-front-2.png';
import propellerTop3 from '../assets/sprites-player/propeller-front-3.png';
import propellerTop4 from '../assets/sprites-player/propeller-front-4.png';
import propellerTop5 from '../assets/sprites-player/propeller-front-5.png';
import propellerTop6 from '../assets/sprites-player/propeller-front-6.png';

const propellerSide = [propellerSide1, propellerSide2, propellerSide3, propellerSide4, propellerSide5, propellerSide6];
const propellerTop = [propellerTop1, propellerTop2, propellerTop3, propellerTop4, propellerTop5, propellerTop6];

function Player({ viewMode, planeRef, propellerRef, propellerFrame, isAngry, planeImage, showHitboxes, blink, immune }) {
  const planeFilter = immune ? 'drop-shadow(0 0 .5em rgba(124, 124, 124, 1))' : 'none';
  const pigImage = viewMode === 'horizontal'
    ? (blink ? pigSide3 : isAngry ? pigSide2 :  pigSide1)
    : (blink ? pigFront3 : isAngry ? pigFront2 :  pigFront1);
    

  const propellerImage = viewMode === 'horizontal'
    ? propellerSide[propellerFrame]
    : propellerTop[propellerFrame];

  const planeSize = viewMode === 'horizontal'
    ? { width: 102, height: 44 }
    : { width: 100, height: 100 };

  const pigSize = { width: 82, height: 56 };

  const propellerSize = viewMode === 'horizontal'
    ? { width: 8, height: 24 }
    : { width: 28, height: 10 };

  return (
    <div
      className="player-wrapper"
      ref={planeRef}
      style={{
        position: 'absolute',
        left: '100px',
        top: '200px',
        width: `${planeSize.width}px`,
        height: `${planeSize.width}px`,
      }}
    >
      {/* Avión */}
      <img
        src={planeImage}
        alt="plane"
        className="plane"
        style={{
          width: `${planeSize.width}px`,
          height: `${planeSize.height}px`,
          position: 'absolute',
          left: 0,
          top: viewMode === 'horizontal' ? 48 : 0,
          opacity: blink ? 0.6 : 1,
          transition: 'opacity 0.5s',
        }}
      />

      {/* Cerdito */}
      <img
        src={pigImage}
        alt="pig"
        className="pig"
        style={{
          width: `${pigSize.width}px`,
          height: `${pigSize.height}px`,
          position: 'absolute',
          left: viewMode === 'horizontal' ? 10 : 10,
          top: viewMode === 'horizontal' ? 12 : 12,
          opacity: blink ? 0.6 : 1,
          transition: 'opacity 0.5s',
        }}
      />

      {/* Hélice */}
      <img
        src={propellerImage}
        alt="propeller"
        className="propeller"
        ref={propellerRef}
        style={{
          width: `${propellerSize.width}px`,
          height: `${propellerSize.height}px`,
          position: 'absolute',
          left: viewMode === 'horizontal' ? 98 : 36,
          top: viewMode === 'horizontal' ? 62 : 96,   
          opacity: blink ? 0.6 : 1,
          transition: 'opacity 0.5s',
        }}
      />

      {/* Área de colisión visible para testeo */}
      {showHitboxes && (
        <div
          className="collision-box"
          style={{
            position: 'absolute',
            left: '16px',
            top: '16px',
            width: '66px',
            height: '66px',
            border: '2px dashed red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export default Player;
