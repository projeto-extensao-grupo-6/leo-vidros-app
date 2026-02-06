import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { routes } from './provider/route.jsx';
import ErrorBoundary from './shared/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={routes} />
    </ErrorBoundary>
  );
}

export default App;