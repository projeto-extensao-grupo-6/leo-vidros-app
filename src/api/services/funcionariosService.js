import Api from '../client/Api';
import BaseService from '../client/BaseService';

class FuncionariosService extends BaseService {
  constructor() {
    super(Api);
  }

  getAll() {
    return this.get('/funcionarios');
  }

  getById(id) {
    return this.get(`/funcionarios/${id}`);
  }

  create(funcionario) {
    return this.post('/funcionarios', funcionario);
  }

  update(id, funcionario) {
    return this.put(`/funcionarios/${id}`, funcionario);
  }

  delete(id) {
    return super.delete(`/funcionarios/${id}`);
  }

  getAgenda(id, dataInicio, dataFim) {
    return this.get(`/funcionarios/${id}/agenda`, {
      params: { dataInicio, dataFim },
    });
  }

  getDisponiveis(data, inicio, fim) {
    return this.get('/funcionarios/disponiveis', {
      params: { data, inicio, fim },
    });
  }

  removerDeAgendamento(agendamentoId, funcionarioId) {
    return super.delete(`/agendamentos/${agendamentoId}/funcionarios/${funcionarioId}`);
  }

  adicionarAoAgendamento(agendamentoId, funcionarioId) {
    return this.post(`/agendamentos/${agendamentoId}/funcionarios/${funcionarioId}`);
  }
}

export const funcionariosService = new FuncionariosService();
export default funcionariosService;
