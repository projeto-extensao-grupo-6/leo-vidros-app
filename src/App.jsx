import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { appRouter } from './router/AppRouter.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { queryClient } from './lib/queryClient.js';

/**
 * Componente raiz da aplicação.
 * Configura a árvore de providers:
 *   QueryClientProvider  → cache e sincronização de dados (TanStack Query)
 *   UserProvider         → dados do usuário autenticado em contexto global
 *   RouterProvider       → roteamento via React Router v6
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={appRouter} />
      </UserProvider>
      {/* DevTools visíveis apenas em desenvolvimento */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;