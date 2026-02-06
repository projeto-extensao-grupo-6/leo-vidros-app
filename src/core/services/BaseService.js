import apiClient from '../api/axios.config';

/**
 * Classe base para serviços
 * Fornece métodos CRUD padrão para todos os services
 */
export class BaseService {
  /**
   * @param {string} endpoint - Endpoint base da API (ex: '/usuarios', '/produtos')
   */
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Busca todos os registros
   * @param {Object} params - Parâmetros de query string
   * @returns {Promise} Promise com resultado
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(this.endpoint, { params });
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'buscar registros');
    }
  }

  /**
   * Busca um registro por ID
   * @param {string|number} id - ID do registro
   * @returns {Promise} Promise com resultado
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'buscar registro');
    }
  }

  /**
   * Cria um novo registro
   * @param {Object} data - Dados do registro
   * @returns {Promise} Promise com resultado
   */
  async create(data) {
    try {
      const response = await apiClient.post(this.endpoint, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'criar registro');
    }
  }

  /**
   * Atualiza um registro existente
   * @param {string|number} id - ID do registro
   * @param {Object} data - Dados atualizados
   * @returns {Promise} Promise com resultado
   */
  async update(id, data) {
    try {
      const response = await apiClient.put(`${this.endpoint}/${id}`, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'atualizar registro');
    }
  }

  /**
   * Atualização parcial de um registro
   * @param {string|number} id - ID do registro
   * @param {Object} data - Dados a atualizar
   * @returns {Promise} Promise com resultado
   */
  async patch(id, data) {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}`, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'atualizar registro parcialmente');
    }
  }

  /**
   * Deleta um registro
   * @param {string|number} id - ID do registro
   * @returns {Promise} Promise com resultado
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'deletar registro');
    }
  }

  /**
   * Tratamento de erros padronizado
   * @param {Error} error - Objeto de erro
   * @param {string} action - Ação sendo executada (para mensagem)
   * @returns {Object} Objeto com informações do erro
   */
  handleError(error, action = 'executar operação') {
    console.error(`Erro ao ${action}:`, error);
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || error.message 
      || `Erro ao ${action}`;
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
      details: error.response?.data
    };
  }

  /**
   * Requisição customizada GET
   * @param {string} path - Caminho adicional ao endpoint
   * @param {Object} config - Configuração do axios
   * @returns {Promise} Promise com resultado
   */
  async customGet(path = '', config = {}) {
    try {
      const url = path ? `${this.endpoint}/${path}` : this.endpoint;
      const response = await apiClient.get(url, config);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'executar requisição');
    }
  }

  /**
   * Requisição customizada POST
   * @param {string} path - Caminho adicional ao endpoint
   * @param {Object} data - Dados da requisição
   * @param {Object} config - Configuração do axios
   * @returns {Promise} Promise com resultado
   */
  async customPost(path = '', data = {}, config = {}) {
    try {
      const url = path ? `${this.endpoint}/${path}` : this.endpoint;
      const response = await apiClient.post(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'executar requisição');
    }
  }
}

export default BaseService;
