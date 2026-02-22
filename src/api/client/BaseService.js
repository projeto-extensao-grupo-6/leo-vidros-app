/**
 * Classe base para todos os services HTTP.
 *
 * Encapsula a instância Axios e padroniza o formato de resposta:
 *   { success: boolean, data: T | null, error?: string, status?: number }
 *
 * Uso:
 *   class MeuService extends BaseService {
 *     constructor() { super(Api); }
 *     listar() { return this.get('/meus-recursos'); }
 *   }
 */
class BaseService {
  /**
   * @param {import('axios').AxiosInstance} api - Instância Axios configurada
   */
  constructor(api) {
    this.api = api;
  }

  /**
   * Executa uma promise Axios e normaliza o resultado para o formato padrão.
   * @template T
   * @param {Promise} promise
   * @returns {Promise<{ success: boolean, data: T | null, error?: string, status?: number }>}
   */
  async _handle(promise) {
    try {
      const response = await promise;
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ??
          error.message ??
          'Erro na requisição',
        status: error.response?.status,
      };
    }
  }

  /**
   * GET request.
   * @param {string} url
   * @param {object} [config] - Config Axios opcional
   */
  get(url, config) {
    return this._handle(this.api.get(url, config));
  }

  /**
   * POST request.
   * @param {string} url
   * @param {*} data
   * @param {object} [config]
   */
  post(url, data, config) {
    return this._handle(this.api.post(url, data, config));
  }

  /**
   * PUT request.
   * @param {string} url
   * @param {*} data
   * @param {object} [config]
   */
  put(url, data, config) {
    return this._handle(this.api.put(url, data, config));
  }

  /**
   * DELETE request.
   * @param {string} url
   * @param {object} [config]
   */
  delete(url, config) {
    return this._handle(this.api.delete(url, config));
  }
}

export default BaseService;
