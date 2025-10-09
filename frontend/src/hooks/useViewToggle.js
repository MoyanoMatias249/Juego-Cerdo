// src/hooks/useViewToggle.js

import { useState } from 'react';

function useViewToggle() {
  const [viewMode, setViewMode] = useState('horizontal');

  const toggleView = () => {
    setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return { viewMode, toggleView };
}

export default useViewToggle;