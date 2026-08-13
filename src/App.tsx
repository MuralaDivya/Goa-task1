import React, { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { SharePage } from './pages/Share';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // Route check for /share/:id
  const shareMatch = currentPath.match(/^\/share\/([a-zA-Z0-9_-]+)/);

  if (shareMatch && shareMatch[1]) {
    return <SharePage shareId={shareMatch[1]} onNavigateHome={navigateToHome} />;
  }

  return <Home />;
}
