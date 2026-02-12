import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../api/endpoints';

/**
 * Service para gerenciamento de agendamentos
 * Extende BaseService para herdar métodos CRUD padrão
 */
class AgendamentosService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.APPOINTMENTS);
  }

  /**
   * Cria um novo agendamento
   * @param {Object} agendamento - Dados do agendamento
   * @returns {Promise} Agendamento criado
   */
  async create(agendamento) {
    const result = await super.create(agendamento);
    
    // Para manter compatibilidade com código legado que espera apenas response.data
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  }

  /**
   * Busca todos os agendamentos
   * @returns {Promise} Lista de agendamentos
   */
  async getAll() {
    const result = await super.getAll();
    
    // Para manter compatibilidade com código legado
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  }

  /**
   * Busca agendamento por ID
   * @param {string|number} id - ID do agendamento
   * @returns {Promise} Agendamento encontrado
   */
  async getById(id) {
    const result = await super.getById(id);
    
    // Para manter compatibilidade com código legado
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  }

  /**
   * Deleta um agendamento
   * @param {string|number} id - ID do agendamento
   * @returns {Promise} Resultado da operação
   */
  async delete(id) {
    console.log(` Deletando agendamento ${id}...`);
    
    const result = await super.delete(id);
    
    if (result.success) {
      console.log(` Agendamento ${id} deletado com sucesso`);
      return result.data;
    } else {
      console.error(` Erro ao deletar agendamento ${id}:`, result.error);
      throw new Error(result.error);
    }
  }
}

// Exportar instância e classe para compatibilidade
const agendamentosServiceInstance = new AgendamentosService();
export { agendamentosServiceInstance as agendamentosService };
export default agendamentosServiceInstance;
