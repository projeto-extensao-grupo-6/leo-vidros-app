/**
 * Fábrica centralizada de Query Keys para o TanStack Query.
 *
 * Padrão de chaves hierárquicas:
 *   ['dominio']                  → coleção inteira (ex: invalidar tudo de pedidos)
 *   ['dominio', 'lista']         → listagem paginada/filtrada
 *   ['dominio', 'detalhe', id]   → entidade individual
 *   ['dominio', 'subrecurso']    → sub-recurso específico
 *
 * Uso:
 *   queryKeys.pedidos.all()          → ['pedidos']
 *   queryKeys.pedidos.list()         → ['pedidos', 'lista']
 *   queryKeys.pedidos.detail(42)     → ['pedidos', 'detalhe', 42]
 */
export const queryKeys = {
  // ─── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    all: () => ['dashboard'],
    qtdAgendamentosHoje: () => ['dashboard', 'qtdAgendamentosHoje'],
    qtdAgendamentosFuturos: () => ['dashboard', 'qtdAgendamentosFuturos'],
    agendamentosFuturos: () => ['dashboard', 'agendamentosFuturos'],
    estoqueCritico: () => ['dashboard', 'estoqueCritico'],
    taxaOcupacaoServicos: () => ['dashboard', 'taxaOcupacaoServicos'],
    qtdItensCriticos: () => ['dashboard', 'qtdItensCriticos'],
    qtdServicosHoje: () => ['dashboard', 'qtdServicosHoje'],
  },

  // ─── Agendamentos ──────────────────────────────────────────────────────────
  agendamentos: {
    all: () => ['agendamentos'],
    list: () => ['agendamentos', 'lista'],
    detail: (id) => ['agendamentos', 'detalhe', id],
  },

  // ─── Pedidos ───────────────────────────────────────────────────────────────
  pedidos: {
    all: () => ['pedidos'],
    list: () => ['pedidos', 'lista'],
    produtos: () => ['pedidos', 'produtos'],
    servicos: () => ['pedidos', 'servicos'],
    detail: (id) => ['pedidos', 'detalhe', id],
    byEtapa: (etapa) => ['pedidos', 'etapa', etapa],
  },

  // ─── Serviços ──────────────────────────────────────────────────────────────
  servicos: {
    all: () => ['servicos'],
    list: () => ['servicos', 'lista'],
    detail: (id) => ['servicos', 'detalhe', id],
    byEtapa: (etapa) => ['servicos', 'etapa', etapa],
  },
};
