// src/components/ui/PowerUpState.jsx
import immuneIcon   from '../../assets/sprites-ui/state-immune.png';
import piercingIcon from '../../assets/sprites-ui/state-piercing.png';
import damageIcon   from '../../assets/sprites-ui/state-damage.png';

const TOTAL_DURATIONS = {
  invulnerable: 5,
  piercing:     10,
  damage:       10,
};

const ICONS = {
  invulnerable: immuneIcon,
  piercing:     piercingIcon,
  damage:       damageIcon,
};

function PowerUpState({ activePowerUp, powerUpTimeLeft }) {
  if (!activePowerUp) return null;

  const total   = TOTAL_DURATIONS[activePowerUp] ?? 10;
  const percent = Math.min(1, Math.max(0, powerUpTimeLeft / total));
  const icon    = ICONS[activePowerUp];

  if (!icon) return null;

  return (
    <div style={{
      position: 'absolute',
      top:      '140px',
      left:     '10px',
      zIndex:   100,
    }}>
      <div style={{
        width:          '42px',
        height:         '40px',
        overflow:       'hidden',
        imageRendering: 'pixelated',
      }}>
        <div style={{
          width:              `${Math.round(42 * percent)}px`,
          height:             '40px',
          backgroundImage:    `url(${icon})`,
          backgroundSize:     '42px 40px',
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'left',
          animation:          percent < 0.3 ? 'pulse 0.5s infinite' : 'none',
          transition:         'width 0.5s linear',
        }} />
      </div>
    </div>
  );
}

export default PowerUpState;