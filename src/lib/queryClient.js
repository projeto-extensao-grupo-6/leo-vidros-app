import { QueryClient } from '@tanstack/react-query';

/**
 * Instância global do QueryClient configurada com defaults sensatos.
 *
 * - staleTime: 60 s  → dados servidos do cache por 1 min sem re-fetch
 * - gcTime:    5 min → dados removidos da memória após 5 min sem observadores
 * - retry: 1         → tenta 1 vez extra antes de reportar erro
 * - refetchOnWindowFocus: false → evita re-fetch agressivo ao trocar aba
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,        // 1 minuto
      gcTime: 1000 * 60 * 5,       // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
