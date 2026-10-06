// src/components/enemies/DeathAnimations.jsx

import smoke1 from '../../assets/sprites-enemies/dead-smoke-1.png';
import smoke2 from '../../assets/sprites-enemies/dead-smoke-2.png';
import smoke3 from '../../assets/sprites-enemies/dead-smoke-3.png';
import smoke4 from '../../assets/sprites-enemies/dead-smoke-4.png';

const SMOKE_FRAMES = [smoke1, smoke2, smoke3, smoke4];

// El sprite mide 41x28 — lo centramos sobre el punto de muerte del enemigo
const SPRITE_W = 82;
const SPRITE_H = 56;

function DeathAnimations({ deathAnims }) {
  return (
    <>
      {deathAnims.map((anim) => (
        <img
          key={anim.id}
          src={SMOKE_FRAMES[anim.frame]}
          alt=""
          aria-hidden="true"
          style={{
            position:      'absolute',
            left:          `${anim.x - SPRITE_W / 2}px`,
            top:           `${anim.y - SPRITE_H / 2}px`,
            width:         `${SPRITE_W}px`,
            height:        `${SPRITE_H}px`,
            pointerEvents: 'none',
            zIndex:        8,       // por encima de enemigos y balas
            imageRendering: 'pixelated', // preserva el pixel art sin blur
          }}
        />
      ))}
    </>
  );
}

export default DeathAnimations;
