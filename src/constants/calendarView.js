import { TipoAgendamento } from '../types/enums';

/**
 * Mapa de cores por tipo de agendamento.
 * Utiliza o enum centralizado TipoAgendamento de src/types/enums.
 */
export const coresAgendamentos = {
  [TipoAgendamento.ORCAMENTO]: '#93c5fd',
  [TipoAgendamento.SERVICO]: '#fca5a5',
};
