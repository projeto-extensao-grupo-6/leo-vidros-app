import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { agendamentosService } from '../../api/services/agendamentosService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const unwrapList = async (promise) => {
  const res = await promise;
  if (!res.success) throw new Error(res.error ?? 'Erro ao carregar agendamentos');
  return Array.isArray(res.data) ? res.data : [];
};

const unwrapOne = async (promise) => {
  const res = await promise;
  if (!res.success) throw new Error(res.error ?? 'Erro ao carregar agendamento');
  return res.data ?? null;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista todos os agendamentos.
 */
export function useAgendamentos(options = {}) {
  return useQuery({
    queryKey: queryKeys.agendamentos.list(),
    queryFn: () => unwrapList(agendamentosService.getAll()),
    ...options,
  });
}

/**
 * Detalhes de um agendamento por ID.
 */
export function useAgendamento(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.agendamentos.detail(id),
    queryFn: () => unwrapOne(agendamentosService.getById(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Cria um novo agendamento e invalida o cache da listagem.
 */
export function useCriarAgendamento(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dados) => agendamentosService.create(dados),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.agendamentos.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
    ...options,
  });
}

/**
 * Atualiza um agendamento e invalida o cache da listagem e do item.
 */
export function useAtualizarAgendamento(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => agendamentosService.update(id, dados),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.agendamentos.all() });
      qc.invalidateQueries({ queryKey: queryKeys.agendamentos.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
    ...options,
  });
}

/**
 * Remove um agendamento e invalida o cache.
 */
export function useDeletarAgendamento(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => agendamentosService.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.agendamentos.all() });
      qc.removeQueries({ queryKey: queryKeys.agendamentos.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
    ...options,
  });
}
