import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { appRouter } from './router/AppRouter.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { queryClient } from './lib/queryClient.js';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={appRouter} />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;