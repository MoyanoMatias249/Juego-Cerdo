import '../../styles/mobileControls.css';

function MobileControls({ onAction }) {
  const sendKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, code: key }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key, code: key }));
  };

  const holdKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, code: key }));
  };

  const releaseKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key, code: key }));
  };

  return (
    <div className="mobile-controls-overlay">
      {/* Opciones arriba */}
      <div className="mobile-options">
        <button onClick={() => sendKey('e')}>🎨</button>
        <button onClick={() => sendKey('f')}>😡</button>
        <button onClick={() => sendKey('Tab')}>📦</button>
      </div>

      {/* Movimiento y disparo abajo */}
      <div className="mobile-bottom">
        <div className="mobile-move">
          <button
            onTouchStart={() => holdKey('ArrowUp')}
            onTouchEnd={() => releaseKey('ArrowUp')}
            onMouseDown={() => holdKey('ArrowUp')}
            onMouseUp={() => releaseKey('ArrowUp')}
          >⬆️</button>
          <div className="mobile-move-row">
            <button
              onTouchStart={() => holdKey('ArrowLeft')}
              onTouchEnd={() => releaseKey('ArrowLeft')}
              onMouseDown={() => holdKey('ArrowLeft')}
              onMouseUp={() => releaseKey('ArrowLeft')}
            >⬅️</button>
            <button
              onTouchStart={() => holdKey('ArrowRight')}
              onTouchEnd={() => releaseKey('ArrowRight')}
              onMouseDown={() => holdKey('ArrowRight')}
              onMouseUp={() => releaseKey('ArrowRight')}
            >➡️</button>
          </div>
          <button
            onTouchStart={() => holdKey('ArrowDown')}
            onTouchEnd={() => releaseKey('ArrowDown')}
            onMouseDown={() => holdKey('ArrowDown')}
            onMouseUp={() => releaseKey('ArrowDown')}
          >⬇️</button>
        </div>

        <div className="mobile-actions">
            <button
                onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }))}
                onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space' }))}
                onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }))}
                onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space' }))}
            >🔫</button>
            <button onClick={() => sendKey('q')}>🔄</button>
        </div>
      </div>
    </div>
  );
}

export default MobileControls;
