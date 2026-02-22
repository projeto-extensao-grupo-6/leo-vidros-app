/**
 * Enums globais de tipos e status da aplicação.
 * Centralizado em src/types/ para evitar strings espalhadas no código.
 */

// ──────────────────────────────────────────────────────────────────────────────
// AGENDAMENTOS
// ──────────────────────────────────────────────────────────────────────────────

export const TipoAgendamento = Object.freeze({
  ORCAMENTO: 'ORCAMENTO',
  SERVICO: 'SERVICO',
});

export const StatusAgendamento = Object.freeze({
  PENDENTE: 'PENDENTE',
  CONFIRMADO: 'CONFIRMADO',
  CANCELADO: 'CANCELADO',
  CONCLUIDO: 'CONCLUIDO',
});

// ──────────────────────────────────────────────────────────────────────────────
// PEDIDOS
// ──────────────────────────────────────────────────────────────────────────────

export const TipoPedido = Object.freeze({
  PRODUTO: 'PRODUTO',
  SERVICO: 'SERVICO',
});

export const StatusPedido = Object.freeze({
  EM_ABERTO: 'EM_ABERTO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO',
});

// ──────────────────────────────────────────────────────────────────────────────
// SOLICITAÇÕES / ACESSO
// ──────────────────────────────────────────────────────────────────────────────

export const StatusSolicitacao = Object.freeze({
  PENDENTE: 'PENDENTE',
  ACEITO: 'ACEITO',
  RECUSADO: 'RECUSADO',
});

// Mapa de labels de aba → valor de status de API
export const StatusSolicitacaoMap = Object.freeze({
  Pendentes: StatusSolicitacao.PENDENTE,
  Aprovados: StatusSolicitacao.ACEITO,
  Recusados: StatusSolicitacao.RECUSADO,
});

// ──────────────────────────────────────────────────────────────────────────────
// ESTOQUE
// ──────────────────────────────────────────────────────────────────────────────

export const TipoMovimentacao = Object.freeze({
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
});

export const StatusEstoque = Object.freeze({
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  CRITICO: 'CRITICO',
});
