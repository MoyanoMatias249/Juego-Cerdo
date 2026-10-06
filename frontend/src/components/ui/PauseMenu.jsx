// src/components/ui/PauseMenu.jsx

function PauseMenu({ onResume, onRestart, onMenu }) {
  const [hover, setHover] = React.useState(null);

  const btn = (id, label, onClick, color = '#fff') => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(id)}
      onMouseLeave={() => setHover(null)}
      style={{
        width:           '220px',
        padding:         '11px 0',
        fontFamily:      'monospace',
        fontSize:        '15px',
        fontWeight:      'bold',
        letterSpacing:   '2px',
        backgroundColor: hover === id ? color : 'transparent',
        color:           hover === id ? '#000' : color,
        border:          `2px solid ${color}`,
        borderRadius:    '7px',
        cursor:          'pointer',
        transition:      'all 0.15s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      position:        'absolute',
      top:             0, left: 0,
      width:           '800px', height: '500px',
      backgroundColor: 'rgba(0,0,0,0.80)',
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      zIndex:          8000,
      fontFamily:      'monospace',
      color:           'white',
    }}>
      <h2 style={{
        fontSize:      '42px',
        letterSpacing: '6px',
        margin:        '0 0 36px 0',
        textTransform: 'uppercase',
        color:         '#facc15',
        textShadow:    '0 0 16px rgba(255,200,0,0.4)',
      }}>
        PAUSA
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {btn('resume',  'REANUDAR',    onResume,  '#4ade80')}
        {btn('restart', 'REINICIAR',   onRestart, '#facc15')}
        {btn('menu',    'IR AL MENÚ',  onMenu,    '#f87171')}
      </div>

      <p style={{ marginTop: '28px', fontSize: '11px', color: '#555', letterSpacing: '1px' }}>
        ESC · P para reanudar
      </p>
    </div>
  );
}

import React from 'react';
export default PauseMenu;
