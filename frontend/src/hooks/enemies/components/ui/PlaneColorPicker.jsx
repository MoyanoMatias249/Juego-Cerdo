// src/components/ui/PlaneColorPicker.jsx
/*
  Selector de color del avión usando CSS hue-rotate.

  Los swatches fueron calculados matemáticamente rotando el hue del rojo
  base del sprite (#E42F00, HSL 12.4° 100% 44.7%) con cada valor de rotación.
  Así el color del círculo representa exactamente cómo quedará el avión.

  hue = 0 → sin modificación (rojo original del sprite).
*/

export const PLANE_COLORS = [
  { label: 'Rojo',     hue:   0, swatch: '#e42f00' }, // original
  { label: 'Naranja',  hue:  30, swatch: '#e4a100' },
  { label: 'Amarillo', hue:  60, swatch: '#b5e400' },
  { label: 'Verde',    hue: 120, swatch: '#00e42f' },
  { label: 'Cian',     hue: 180, swatch: '#00b5e4' },
  { label: 'Azul',     hue: 210, swatch: '#0043e4' },
  { label: 'Violeta',  hue: 270, swatch: '#a100e4' },
  { label: 'Rosa',     hue: 320, swatch: '#e40069' },
];

export function buildPlaneFilter(hue) {
  if (hue === 0) return 'none';
  return `hue-rotate(${hue}deg)`;
}

function PlaneColorPicker({ selectedHue, onChange }) {
  return (
    <div style={{
      display:        'flex',
      gap:            '8px',
      alignItems:     'center',
      justifyContent: 'center',
      flexWrap:       'wrap',
    }}>
      {PLANE_COLORS.map((c) => {
        const selected = selectedHue === c.hue;
        return (
          <button
            key={c.hue}
            title={c.label}
            onClick={() => onChange(c.hue)}
            style={{
              width:           '26px',
              height:          '26px',
              borderRadius:    '50%',
              backgroundColor: c.swatch,
              border:          selected
                ? '3px solid white'
                : '2px solid rgba(255,255,255,0.15)',
              cursor:          'pointer',
              padding:         0,
              boxShadow:       selected
                ? `0 0 10px ${c.swatch}, 0 0 4px rgba(255,255,255,0.4)`
                : 'none',
              transition:      'all 0.12s',
              transform:       selected ? 'scale(1.25)' : 'scale(1)',
            }}
          />
        );
      })}
    </div>
  );
}

export default PlaneColorPicker;