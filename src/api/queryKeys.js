export const queryKeys = {
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

  agendamentos: {
    all: () => ['agendamentos'],
    list: () => ['agendamentos', 'lista'],
    detail: (id) => ['agendamentos', 'detalhe', id],
  },

  pedidos: {
    all: () => ['pedidos'],
    list: () => ['pedidos', 'lista'],
    produtos: () => ['pedidos', 'produtos'],
    servicos: () => ['pedidos', 'servicos'],
    detail: (id) => ['pedidos', 'detalhe', id],
    byEtapa: (etapa) => ['pedidos', 'etapa', etapa],
  },

  servicos: {
    all: () => ['servicos'],
    list: () => ['servicos', 'lista'],
    detail: (id) => ['servicos', 'detalhe', id],
    byEtapa: (etapa) => ['servicos', 'etapa', etapa],
  },
};
