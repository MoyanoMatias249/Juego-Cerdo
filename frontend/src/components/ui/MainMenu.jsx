// src/components/ui/MainMenu.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPlayerData } from '../../utils/playerData';
import PlaneColorPicker, { buildPlaneFilter, PLANE_COLORS } from './PlaneColorPicker';

// Sprites del cerdo por dificultad
import pigFront1        from '../../assets/sprites-player/pig-front-1.png';
import pigFront3        from '../../assets/sprites-player/pig-front-3.png';
import pigSide1         from '../../assets/sprites-player/pig-side-1.png';
import pigSide3         from '../../assets/sprites-player/pig-side-3.png';
import pigFrontCap1     from '../../assets/sprites-player/pig-front-cap-1.png';
import pigFrontCap2     from '../../assets/sprites-player/pig-front-cap-2.png';
import pigSideCap1      from '../../assets/sprites-player/pig-side-cap-1.png';
import pigSideCap2      from '../../assets/sprites-player/pig-side-cap-2.png';
import pigFrontGlasses1 from '../../assets/sprites-player/pig-front-glasses-1.png';
import pigFrontGlasses2 from '../../assets/sprites-player/pig-front-glasses-2.png';
import pigSideGlasses1  from '../../assets/sprites-player/pig-side-glasses-1.png';
import pigSideGlasses2  from '../../assets/sprites-player/pig-side-glasses-2.png';

// Sprite del avión (vista lateral)
import planeSide from '../../assets/sprites-player/red-plane-side.png';

const PIG_BY_DIFF = {
  easy:   { front: pigFrontCap1,     frontCry: pigFrontCap2,     side: pigSideCap1,     sideCry: pigSideCap2     },
  normal: { front: pigFront1,        frontCry: pigFront3,        side: pigSide1,        sideCry: pigSide3        },
  hard:   { front: pigFrontGlasses1, frontCry: pigFrontGlasses2, side: pigSideGlasses1, sideCry: pigSideGlasses2 },
};

const DIFFICULTIES = [
  { id: 'easy',   label: 'Fácil',   description: '10 vidas · 5 corazones', color: '#4ade80' },
  { id: 'normal', label: 'Normal',  description: '6 vidas · 3 corazones',  color: '#facc15' },
  { id: 'hard',   label: 'Difícil', description: '2 vidas · 1 corazón',    color: '#f87171' },
];

const PIG_SIZE   = { width: 164, height: 112 };   // 82×56 × 2
const PLANE_SIZE = { width: 204, height: 88  };    // 102×44 × 2

function MainMenu({ onStart, initialPlaneHue = 0 }) {
  const [selected,    setSelected]    = useState('normal');
  const [hoverStart,  setHoverStart]  = useState(false);
  const [pigHover,    setPigHover]    = useState(false);
  const [pigCrying,   setPigCrying]   = useState(false);
  const [planeHue,    setPlaneHue]    = useState(initialPlaneHue);

  const cryTimerRef = useRef(null);
  const player      = getPlayerData();

  // Space → cerdo llora 1 frame
  const handleKey = useCallback((e) => {
    if (e.code !== 'Space') return;
    e.preventDefault();
    setPigCrying(true);
    if (cryTimerRef.current) clearTimeout(cryTimerRef.current);
    cryTimerRef.current = setTimeout(() => setPigCrying(false), 180);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (cryTimerRef.current) clearTimeout(cryTimerRef.current);
    };
  }, [handleKey]);

  // Sprite del cerdo
  const pig      = PIG_BY_DIFF[selected] ?? PIG_BY_DIFF.normal;
  const pigSprite = pigHover
    ? (pigCrying ? pig.sideCry  : pig.side)
    : (pigCrying ? pig.frontCry : pig.front);

  return (
    <div style={{
      width: '800px', height: '500px',
      background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0a0a0a 70%)',
      color: 'white', fontFamily: 'monospace',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', userSelect: 'none',
    }}>

      {/* Título */}
      <h1 style={{
        fontSize: '48px', margin: '0 0 2px 0',
        letterSpacing: '4px', textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(255,200,0,0.6)', color: '#facc15',
      }}>
        pig to heaven
      </h1>

      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px 0', letterSpacing: '2px' }}>
        {player.name.toUpperCase()} &nbsp;·&nbsp; {player.attempts} INTENTOS
      </p>

      {/* Récord */}
      {player.maxScore > 0 && (
        <div style={{
          marginBottom: '12px', padding: '6px 24px',
          border: '1px solid #333', borderRadius: '8px',
          background: 'rgba(255,255,255,0.04)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '1px', letterSpacing: '1px' }}>MEJOR PUNTUACIÓN</div>
          <div style={{ fontSize: '20px', color: '#facc15' }}>{player.maxScore}</div>
        </div>
      )}

      {/* Fila: avión  +  cerdo  */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '6px' }}>

        {/* Avión con filtro de color */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={planeSide}
            alt="plane"
            style={{
              width:          `${PLANE_SIZE.width}px`,
              height:         `${PLANE_SIZE.height}px`,
              imageRendering: 'pixelated',
              filter:         buildPlaneFilter(planeHue),
              display:        'block',
              marginBottom:   '8px',
            }}
          />
          {/* Selector de color */}
          <PlaneColorPicker selectedHue={planeHue} onChange={setPlaneHue} />
        </div>

        {/* Cerdo interactivo */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={pigSprite}
            alt="pig"
            onMouseEnter={() => setPigHover(true)}
            onMouseLeave={() => setPigHover(false)}
            style={{
              width:          `${PIG_SIZE.width}px`,
              height:         `${PIG_SIZE.height}px`,
              imageRendering: 'pixelated',
              cursor:         'pointer',
              display:        'block',
              marginBottom:   '4px',
              transform:      pigCrying ? 'scale(0.95)' : 'scale(1)',
              transition:     'transform 0.1s',
            }}
          />
          <p style={{ fontSize: '10px', color: '#555', margin: 0, letterSpacing: '1px' }}>
            hover · espacio
          </p>
        </div>
      </div>

      {/* Selector dificultad */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        {DIFFICULTIES.map((d) => {
          const sel = selected === d.id;
          return (
            <button key={d.id} onClick={() => setSelected(d.id)} style={{
              padding: '8px 16px', minWidth: '126px', textAlign: 'center',
              backgroundColor: sel ? d.color : 'transparent',
              color: sel ? '#000' : d.color,
              border: `2px solid ${d.color}`, borderRadius: '8px',
              cursor: 'pointer', fontFamily: 'monospace',
              fontSize: '13px', fontWeight: 'bold', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: '14px', marginBottom: '2px' }}>{d.label}</div>
              <div style={{ fontSize: '10px', opacity: 0.85 }}>{d.description}</div>
            </button>
          );
        })}
      </div>

      {/* Botón iniciar */}
      <button
        onClick={() => onStart(selected, planeHue)}
        onMouseEnter={() => setHoverStart(true)}
        onMouseLeave={() => setHoverStart(false)}
        style={{
          padding: '12px 44px', fontFamily: 'monospace',
          fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px',
          backgroundColor: hoverStart ? '#facc15' : 'transparent',
          color: hoverStart ? '#000' : '#facc15',
          border: '2px solid #facc15', borderRadius: '8px',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        INICIAR JUEGO
      </button>

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: '12px', fontSize: '11px', color: '#444', letterSpacing: '1px' }}>
        WASD / FLECHAS para mover &nbsp;·&nbsp; ESPACIO para disparar
      </div>
    </div>
  );
}

export default MainMenu;
