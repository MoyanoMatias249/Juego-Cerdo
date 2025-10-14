// src/App.jsx
import { useEffect, useState } from 'react';
import Game from './components/Game';

function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      const maxWidth = 800;
      const newScale = screenWidth < maxWidth ? screenWidth / maxWidth : 1;
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '800px',
        height: '500px',
      }}
    >
      <Game />
    </div>
  </div>
);
}

export default App;
