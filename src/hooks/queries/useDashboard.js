import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import {
  getQtdAgendamentosHoje,
  getAgendamentosFuturos,
  getEstoqueCritico,
  getQtdItensCriticos,
  getFaturamentoMes,
  getFaturamentoAnual,
  getOrcamentosAbertos,
} from "../../api/services/dashboardService";

const unwrap = (field, fallback) => async (fetcher) => {
  const res = await fetcher();
  if (!res.success) throw new Error(res.error ?? "Erro ao carregar dados");
  return field ? (res.data?.[field] ?? fallback) : (res.data ?? fallback);
};

export function useQtdAgendamentosHoje(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.qtdAgendamentosHoje(),
    queryFn: () =>
      unwrap("qtdAgendamentosHoje", 0)(() => getQtdAgendamentosHoje()),
    ...options,
  });
}

export function useAgendamentosFuturos(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.agendamentosFuturos(),
    queryFn: async () => {
      const res = await getAgendamentosFuturos();
      if (!res.success)
        throw new Error(res.error ?? "Erro ao carregar agendamentos futuros");
      return Array.isArray(res.data) ? res.data : [];
    },
    ...options,
  });
}

export function useEstoqueCritico(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.estoqueCritico(),
    queryFn: async () => {
      const res = await getEstoqueCritico();
      if (!res.success)
        throw new Error(res.error ?? "Erro ao carregar estoque crítico");
      return Array.isArray(res.data) ? res.data : [];
    },
    ...options,
  });
}

export function useQtdItensCriticos(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.qtdItensCriticos(),
    queryFn: () => unwrap("quantidade", 0)(() => getQtdItensCriticos()),
    ...options,
  });
}

export function useFaturamentoMes(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.faturamentoMes(),
    queryFn: async () => {
      const res = await getFaturamentoMes();
      if (!res.success) throw new Error(res.error ?? "Erro ao carregar faturamento");
      return res.data ?? { faturamentoMes: 0, percentualVariacao: null };
    },
    ...options,
  });
}

export function useFaturamentoAnual(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.faturamentoAnual(),
    queryFn: async () => {
      const res = await getFaturamentoAnual();
      if (!res.success) throw new Error(res.error ?? "Erro ao carregar faturamento anual");
      return res.data ?? { ano: new Date().getFullYear(), meses: [] };
    },
    ...options,
  });
}

export function useOrcamentosAbertos(options = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.orcamentosAbertos(),
    queryFn: async () => {
      const res = await getOrcamentosAbertos();
      if (!res.success) throw new Error(res.error ?? "Erro ao carregar orçamentos abertos");
      return res.data ?? { quantidade: 0, valorTotal: 0 };
    },
    ...options,
  });
}

export function useDashboardKpis() {
  const qtdAgendamentosHoje = useQtdAgendamentosHoje();
  const agendamentosFuturos = useAgendamentosFuturos();
  const estoqueCritico = useEstoqueCritico();
  const qtdItensCriticos = useQtdItensCriticos();
  const faturamentoMes = useFaturamentoMes();
  const orcamentosAbertos = useOrcamentosAbertos();

  const isLoading =
    qtdAgendamentosHoje.isLoading ||
    agendamentosFuturos.isLoading ||
    estoqueCritico.isLoading ||
    qtdItensCriticos.isLoading ||
    faturamentoMes.isLoading ||
    orcamentosAbertos.isLoading;

  const isError =
    qtdAgendamentosHoje.isError ||
    agendamentosFuturos.isError ||
    estoqueCritico.isError ||
    qtdItensCriticos.isError ||
    faturamentoMes.isError ||
    orcamentosAbertos.isError;

  return {
    qtdAgendamentosHoje: qtdAgendamentosHoje.data ?? 0,
    agendamentosFuturos: agendamentosFuturos.data ?? [],
    itensCriticos: estoqueCritico.data ?? [],
    qtdItensCriticos: qtdItensCriticos.data ?? 0,
    faturamentoMes: faturamentoMes.data?.faturamentoMes ?? 0,
    percentualFaturamento: faturamentoMes.data?.percentualVariacao ?? null,
    orcamentosAberto: orcamentosAbertos.data?.quantidade ?? 0,
    valorOrcamentosAberto: orcamentosAbertos.data?.valorTotal ?? 0,
    isLoading,
    isError,
  };
}
