import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AppProvider } from './app/store';
import { parseRoute } from './app/router';
import HomePage from './ui/pages/Home';
import FormPage from './ui/pages/Form';
import ResultPage from './ui/pages/Result';

function AppContent() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    // Handle custom route change events
    const handleRouteChange = (e) => {
      setRoute(e.detail.route);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('route-change', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('route-change', handleRouteChange);
    };
  }, []);

  switch (route) {
    case 'form':
      return <FormPage />;
    case 'result':
      return <ResultPage />;
    case 'home':
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
