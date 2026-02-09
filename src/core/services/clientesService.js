import { BaseService } from '../../core/services/BaseService';
import { API_ENDPOINTS } from '../../core/api/endpoints';

/**
 * Service para gerenciamento de clientes
 * Extende BaseService para herdar métodos CRUD padrão
 */
class ClientesService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.CLIENTS);
  }

  /**
   * Busca cliente por CPF
   * @param {string} cpf - CPF do cliente
   * @returns {Promise} Promise com cliente
   */
  async getByCPF(cpf) {
    return this.customGet('', {
      params: { cpf }
    });
  }

  /**
   * Busca cliente por email
   * @param {string} email - Email do cliente
   * @returns {Promise} Promise com cliente
   */
  async getByEmail(email) {
    return this.customGet('', {
      params: { email }
    });
  }

  /**
   * Busca histórico de serviços do cliente
   * @param {string|number} id - ID do cliente
   * @returns {Promise} Promise com histórico
   */
  async getHistory(id) {
    return this.customGet(`${id}/historico`);
  }

  /**
   * Busca endereços do cliente
   * @param {string|number} id - ID do cliente
   * @returns {Promise} Promise com endereços
   */
  async getAddresses(id) {
    return this.customGet(`${id}/enderecos`);
  }

  /**
   * Adiciona endereço ao cliente
   * @param {string|number} id - ID do cliente
   * @param {Object} endereco - Dados do endereço
   * @returns {Promise} Promise com resultado
   */
  async addAddress(id, endereco) {
    return this.customPost(`${id}/enderecos`, endereco);
  }
}

// Exporta instância singleton
export const clientesService = new ClientesService();
export default clientesService;
