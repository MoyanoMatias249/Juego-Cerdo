// src/App.jsx
import { useEffect, useState } from 'react';
import Game     from './components/Game';
import MainMenu from './components/ui/MainMenu';
import bgSprite from './assets/sprites-background/background.png';

function App() {
  const [screen,     setScreen]     = useState('menu');
  const [difficulty, setDifficulty] = useState('normal');
  const [planeHue,   setPlaneHue]   = useState(0);
  const [gameKey,    setGameKey]    = useState(0);
  const [scale,      setScale]      = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const sw = window.innerWidth;
      setScale(sw < 800 ? sw / 800 : 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleStart = (diff, hue) => {
    setDifficulty(diff);
    setPlaneHue(hue ?? 0);
    setGameKey(k => k + 1);
    setScreen('game');
  };

  const handleMenu = () => setScreen('menu');

  return (
    <div style={{
      width:           '100vw',
      height:          '100vh',
      display:         'flex',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
      // Fondo general con la imagen del juego, cubriendo toda la pantalla
      backgroundImage:    `url(${bgSprite})`,
      backgroundSize:     'cover',
      backgroundPosition: 'center',
      backgroundRepeat:   'no-repeat',
    }}>
      <div style={{
        transform:       `scale(${scale})`,
        transformOrigin: 'top center',
        width:           '800px',
        height:          '500px',
        // Sombreado para diferenciar el recuadro del juego del fondo
        boxShadow: `
          0 0 0 2px rgba(255,255,255,0.08),
          0 0 40px 10px rgba(0,0,0,0.7),
          0 0 100px 30px rgba(0,0,0,0.5)
        `,
        borderRadius: '4px',
      }}>
        {screen === 'menu' ? (
          <MainMenu
            onStart={handleStart}
            initialPlaneHue={planeHue}
          />
        ) : (
          <Game
            key={gameKey}
            difficulty={difficulty}
            planeHue={planeHue}
            onMenu={handleMenu}
          />
        )}
      </div>
    </div>
  );
}

export default App;