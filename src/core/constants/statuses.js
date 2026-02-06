/**
 * Constantes de Status para Pedidos e Agendamentos
 */

// Status de Pedidos
export const PEDIDO_STATUS = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export const PEDIDO_STATUS_OPTIONS = [
  { value: PEDIDO_STATUS.PENDENTE, label: 'Pendente' },
  { value: PEDIDO_STATUS.CONFIRMADO, label: 'Confirmado' },
  { value: PEDIDO_STATUS.EM_ANDAMENTO, label: 'Em Andamento' },
  { value: PEDIDO_STATUS.CONCLUIDO, label: 'Concluído' },
  { value: PEDIDO_STATUS.CANCELADO, label: 'Cancelado' },
];

// Status de Agendamentos
export const AGENDAMENTO_STATUS = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  CONCLUIDO: 'Concluído',
};

export const AGENDAMENTO_STATUS_OPTIONS = [
  { value: AGENDAMENTO_STATUS.PENDENTE, label: 'Pendente' },
  { value: AGENDAMENTO_STATUS.CONFIRMADO, label: 'Confirmado' },
  { value: AGENDAMENTO_STATUS.CANCELADO, label: 'Cancelado' },
  { value: AGENDAMENTO_STATUS.CONCLUIDO, label: 'Concluído' },
];

// Status de Serviços
export const SERVICO_STATUS = {
  ATIVO: 'Ativo',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const SERVICO_STATUS_OPTIONS = [
  { value: SERVICO_STATUS.ATIVO, label: 'Ativo' },
  { value: SERVICO_STATUS.FINALIZADO, label: 'Finalizado' },
  { value: SERVICO_STATUS.CANCELADO, label: 'Cancelado' },
];

// Etapas de Serviços
export const SERVICO_ETAPAS = {
  AGUARDANDO_ORCAMENTO: 'Aguardando orçamento',
  ORCAMENTO_APROVADO: 'Orçamento aprovado',
  AGUARDANDO_PECAS: 'Aguardando peças',
  EXECUCAO_ANDAMENTO: 'Execução em andamento',
  AGUARDANDO_APROVACAO: 'Aguardando aprovação',
  CONCLUIDO: 'Concluído',
  FINALIZADO: 'Finalizado',
};

export const SERVICO_ETAPAS_OPTIONS = [
  { value: SERVICO_ETAPAS.AGUARDANDO_ORCAMENTO, label: 'Aguardando orçamento', progresso: { atual: 1, total: 6 } },
  { value: SERVICO_ETAPAS.ORCAMENTO_APROVADO, label: 'Orçamento aprovado', progresso: { atual: 2, total: 6 } },
  { value: SERVICO_ETAPAS.AGUARDANDO_PECAS, label: 'Aguardando peças', progresso: { atual: 2, total: 6 } },
  { value: SERVICO_ETAPAS.EXECUCAO_ANDAMENTO, label: 'Execução em andamento', progresso: { atual: 4, total: 6 } },
  { value: SERVICO_ETAPAS.AGUARDANDO_APROVACAO, label: 'Aguardando aprovação', progresso: { atual: 5, total: 6 } },
  { value: SERVICO_ETAPAS.CONCLUIDO, label: 'Concluído', progresso: { atual: 6, total: 6 } },
  { value: SERVICO_ETAPAS.FINALIZADO, label: 'Finalizado', progresso: { atual: 6, total: 6 } },
];

// Status de Funcionários
export const FUNCIONARIO_STATUS = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
};

export const FUNCIONARIO_STATUS_OPTIONS = [
  { value: true, label: 'Ativo' },
  { value: false, label: 'Inativo' },
];

// Status de Clientes
export const CLIENTE_STATUS = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
};

export const CLIENTE_STATUS_OPTIONS = [
  { value: CLIENTE_STATUS.ATIVO, label: 'Ativo' },
  { value: CLIENTE_STATUS.INATIVO, label: 'Inativo' },
];
