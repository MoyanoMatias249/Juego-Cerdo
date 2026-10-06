// src/components/Player.jsx

// Normal
import pigFront1 from '../assets/sprites-player/pig-front-1.png';
import pigFront3 from '../assets/sprites-player/pig-front-3.png';
import pigSide1  from '../assets/sprites-player/pig-side-1.png';
import pigSide3  from '../assets/sprites-player/pig-side-3.png';

// Fácil — gorra
import pigFrontCap1 from '../assets/sprites-player/pig-front-cap-1.png';
import pigFrontCap2 from '../assets/sprites-player/pig-front-cap-2.png';
import pigSideCap1  from '../assets/sprites-player/pig-side-cap-1.png';
import pigSideCap2  from '../assets/sprites-player/pig-side-cap-2.png';

// Difícil — gafas
import pigFrontGlasses1 from '../assets/sprites-player/pig-front-glasses-1.png';
import pigFrontGlasses2 from '../assets/sprites-player/pig-front-glasses-2.png';
import pigSideGlasses1  from '../assets/sprites-player/pig-side-glasses-1.png';
import pigSideGlasses2  from '../assets/sprites-player/pig-side-glasses-2.png';

// Cuello/cuerpo — solo en vista horizontal (side)
import pigBodySide from '../assets/sprites-player/pig-body-side.png';

// Hélice lateral
import propellerSide1 from '../assets/sprites-player/propeller-side-1.png';
import propellerSide2 from '../assets/sprites-player/propeller-side-2.png';
import propellerSide3 from '../assets/sprites-player/propeller-side-3.png';
import propellerSide4 from '../assets/sprites-player/propeller-side-4.png';
import propellerSide5 from '../assets/sprites-player/propeller-side-5.png';
import propellerSide6 from '../assets/sprites-player/propeller-side-6.png';

// Hélice frontal
import propellerTop1 from '../assets/sprites-player/propeller-front-1.png';
import propellerTop2 from '../assets/sprites-player/propeller-front-2.png';
import propellerTop3 from '../assets/sprites-player/propeller-front-3.png';
import propellerTop4 from '../assets/sprites-player/propeller-front-4.png';
import propellerTop5 from '../assets/sprites-player/propeller-front-5.png';
import propellerTop6 from '../assets/sprites-player/propeller-front-6.png';

const propellerSide = [propellerSide1, propellerSide2, propellerSide3, propellerSide4, propellerSide5, propellerSide6];
const propellerTop  = [propellerTop1,  propellerTop2,  propellerTop3,  propellerTop4,  propellerTop5,  propellerTop6];

const PIG_SPRITES = {
  easy: {
    horizontal: { normal: pigSideCap1,      blink: pigSideCap2      },
    vertical:   { normal: pigFrontCap1,     blink: pigFrontCap2     },
  },
  normal: {
    horizontal: { normal: pigSide1,         blink: pigSide3         },
    vertical:   { normal: pigFront1,        blink: pigFront3        },
  },
  hard: {
    horizontal: { normal: pigSideGlasses1,  blink: pigSideGlasses2  },
    vertical:   { normal: pigFrontGlasses1, blink: pigFrontGlasses2 },
  },
};

// Tamaño del cuello/cuerpo lateral (sprite 20×12, escalado ×2 = 40×24)
const NECK_W = 20;
const NECK_H = 12;

function Player({
  viewMode,
  planeRef,
  propellerRef,
  propellerFrame,
  planeImage,
  showHitboxes,
  blink,
  isPowerUpImmune,
  muzzleSprite,
  difficulty = 'normal',
  planeColorFilter = 'none',
}) {
  const powerUpFilter  = isPowerUpImmune ? 'drop-shadow(0 0 .5em #008CF7)' : '';
  const combinedFilter = [planeColorFilter !== 'none' ? planeColorFilter : '', powerUpFilter]
    .filter(Boolean).join(' ') || 'none';

  const pigSet   = PIG_SPRITES[difficulty] ?? PIG_SPRITES.normal;
  const pigView  = viewMode === 'horizontal' ? pigSet.horizontal : pigSet.vertical;
  const pigImage = blink ? pigView.blink : pigView.normal;

  const propellerImage = viewMode === 'horizontal'
    ? propellerSide[propellerFrame]
    : propellerTop[propellerFrame];

  const planeSize = viewMode === 'horizontal'
    ? { width: 102, height: 44 }
    : { width: 100, height: 100 };

  const pigSize       = { width: 82, height: 56 };
  const propellerSize = viewMode === 'horizontal'
    ? { width: 8, height: 24 }
    : { width: 28, height: 10 };

  const opacity = blink ? 0.6 : 1;

  // Posición de la cabeza del cerdo dentro del wrapper
  const pigLeft = 10;
  const pigTop  = 12;

  return (
    <div
      className="player-wrapper"
      ref={planeRef}
      style={{
        position: 'absolute',
        left:     '100px',
        top:      '200px',
        width:    `${planeSize.width}px`,
        height:   `${planeSize.height}px`,
      }}
    >
      {/* Avión */}
      <img
        src={planeImage}
        alt="plane"
        className="plane"
        style={{
          width:    `${planeSize.width}px`,
          height:   `${planeSize.height}px`,
          position: 'absolute',
          left:     0,
          top:      viewMode === 'horizontal' ? 48 : 0,
          opacity,
          transition: 'opacity 0.5s',
          filter:   combinedFilter,
        }}
      />

      {/* Cuello/cuerpo — solo en vista horizontal, debajo de la cabeza */}
      {viewMode === 'horizontal' && (
        <img
          src={pigBodySide}
          alt="pig-body"
          style={{
            position:       'absolute',
            // Centrado horizontalmente respecto a la cabeza (82px de ancho)
            // y colocado justo debajo de ella (top + pigSize.height)
            left:           `42px`,
            top:            `58px`,
            width:          `${NECK_W}px`,
            height:         `${NECK_H}px`,
            zIndex:         2,
            imageRendering: 'pixelated',
            opacity,
            transition:     'opacity 0.5s',
            filter:         powerUpFilter || 'none',
          }}
        />
      )}

      {/* Cerdito (cabeza) */}
      <img
        src={pigImage}
        alt="pig"
        className="pig"
        style={{
          width:    `${pigSize.width}px`,
          height:   `${pigSize.height}px`,
          position: 'absolute',
          left:     `${pigLeft}px`,
          top:      `${pigTop}px`,
          zIndex:         4,
          opacity,
          transition: 'opacity 0.5s',
          filter:   powerUpFilter || 'none',
        }}
      />

      {/* Hélice */}
      <img
        src={propellerImage}
        alt="propeller"
        className="propeller"
        ref={propellerRef}
        style={{
          width:    `${propellerSize.width}px`,
          height:   `${propellerSize.height}px`,
          position: 'absolute',
          left:     viewMode === 'horizontal' ? 98 : 36,
          top:      viewMode === 'horizontal' ? 62 : 96,
          opacity,
          transition: 'opacity 0.5s',
          filter:   combinedFilter,
        }}
      />

      {/* Flash de disparo */}
      {muzzleSprite && (
        <img
          src={muzzleSprite}
          alt="muzzle-flash"
          style={{
            position:      'absolute',
            left:          viewMode === 'horizontal' ? 102 : 28,
            top:           viewMode === 'horizontal' ? 52  : 102,
            width:         viewMode === 'horizontal' ? 22  : 44,
            height:        viewMode === 'horizontal' ? 44  : 22,
            pointerEvents: 'none',
            zIndex:        0,
          }}
        />
      )}

      {/* Hitbox debug */}
      {showHitboxes && (
        <div style={{
          position:        'absolute',
          left:            '24px',
          top:             '26px',
          width:           '52px',
          height:          '50px',
          border:          '2px dashed cyan',
          backgroundColor: 'rgba(0,255,255,0.2)',
          zIndex:          10,
          pointerEvents:   'none',
        }} />
      )}
    </div>
  );
}

export default Player;
