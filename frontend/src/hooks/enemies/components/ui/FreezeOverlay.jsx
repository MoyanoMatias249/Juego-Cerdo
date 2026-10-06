// src/components/ui/FreezeOverlay.jsx
/*
  Overlay visual que aparece cuando el power-up Freeze está activo.
  Muestra un efecto de hielo semitransparente sobre el juego.
  El jugador puede moverse normalmente por debajo (pointerEvents: none).
*/

function FreezeOverlay({ active }) {
  if (!active) return null;

  return (
    <div
      style={{
        position:       'absolute',
        inset:          0,
        zIndex:         500,   // encima de enemigos pero debajo del HUD y pausa
        pointerEvents:  'none',
        // Capa de hielo azul semitransparente
        backgroundColor: 'rgba(150, 220, 255, 0.18)',
        // Viñeta helada en los bordes
        boxShadow:      'inset 0 0 80px rgba(100, 200, 255, 0.45)',
        // Patrón de cristal con gradiente radial
        backgroundImage: `
          radial-gradient(
            ellipse at 20% 20%,
            rgba(200, 240, 255, 0.15) 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse at 80% 80%,
            rgba(150, 210, 255, 0.12) 0%,
            transparent 55%
          )
        `,
        // Animación de parpadeo suave de hielo
        animation: 'freezePulse 1.2s ease-in-out infinite',
      }}
    >
      {/* Texto FREEZE en esquina superior derecha */}
      <div style={{
        position:      'absolute',
        top:           '12px',
        right:         '55px',   // deja espacio al botón de pausa
        fontFamily:    'monospace',
        fontSize:      '13px',
        fontWeight:    'bold',
        letterSpacing: '3px',
        color:         'rgba(180, 235, 255, 0.9)',
        textShadow:    '0 0 8px rgba(100, 200, 255, 0.8)',
        animation:     'freezePulse 1.2s ease-in-out infinite',
      }}>
        ❄ FREEZE
      </div>

      {/* Cristales de hielo en las esquinas */}
      {['0% 0%', '100% 0%', '0% 100%', '100% 100%'].map((pos, i) => (
        <div key={i} style={{
          position:       'absolute',
          width:          '80px',
          height:         '80px',
          background:     `radial-gradient(circle at ${pos}, rgba(200,240,255,0.35) 0%, transparent 70%)`,
          top:            i < 2 ? 0 : 'auto',
          bottom:         i >= 2 ? 0 : 'auto',
          left:           i % 2 === 0 ? 0 : 'auto',
          right:          i % 2 === 1 ? 0 : 'auto',
        }} />
      ))}
    </div>
  );
}

export default FreezeOverlay;