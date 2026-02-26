import Api from "../client/Api";
import BaseService from "../client/BaseService";

/**
 * Service de Agendamentos — estende BaseService para herdar
 * tratamento de erro padronizado e formato de resposta unificado.
 */
class AgendamentosService extends BaseService {
  constructor() {
    super(Api);
  }

  /** Busca todos os agendamentos */
  getAll() {
    return this.get("/agendamentos");
  }

  /** Busca agendamento por ID */
  getById(id) {
    return this.get(`/agendamentos/${id}`);
  }

  /** Cria novo agendamento */
  create(agendamento) {
    return this.post("/agendamentos", agendamento);
  }

  /** Atualiza dados básicos de um agendamento pelo ID */
  update(id, agendamento) {
    return this.put(`/agendamentos/dados-basicos/${id}`, agendamento);
  }

  /** Remove um agendamento pelo ID */
  delete(id) {
    return super.delete(`/agendamentos/${id}`);
  }
}

export const agendamentosService = new AgendamentosService();
export default agendamentosService;
