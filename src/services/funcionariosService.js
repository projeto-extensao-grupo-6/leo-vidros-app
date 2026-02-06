import { BaseService } from '../../core/services/BaseService';
import { API_ENDPOINTS } from '../../core/api/endpoints';

/**
 * Service para gerenciamento de funcionários
 * Extende BaseService para herdar métodos CRUD padrão
 */
class FuncionariosService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.EMPLOYEES);
  }

  /**
   * Busca funcionário por CPF
   * @param {string} cpf - CPF do funcionário
   * @returns {Promise} Promise com funcionário
   */
  async getByCPF(cpf) {
    return this.customGet('', {
      params: { cpf }
    });
  }

  /**
   * Busca funcionários ativos
   * @returns {Promise} Promise com funcionários ativos
   */
  async getActive() {
    return this.customGet('', {
      params: { ativo: true }
    });
  }

  /**
   * Busca funcionários por cargo
   * @param {string} cargo - Cargo do funcionário
   * @returns {Promise} Promise com funcionários
   */
  async getByCargo(cargo) {
    return this.customGet('', {
      params: { cargo }
    });
  }

  /**
   * Busca disponibilidade do funcionário
   * @param {string|number} id - ID do funcionário
   * @param {string} data - Data para verificar disponibilidade
   * @returns {Promise} Promise com disponibilidade
   */
  async getDisponibilidade(id, data) {
    return this.customGet(`${id}/disponibilidade`, {
      params: { data }
    });
  }
}

// Exporta instância singleton
export const funcionariosService = new FuncionariosService();
export default funcionariosService;
