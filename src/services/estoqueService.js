import { BaseService } from '../../core/services/BaseService';
import { API_ENDPOINTS } from '../../core/api/endpoints';

/**
 * Service para gerenciamento de estoque
 * Extende BaseService para herdar métodos CRUD padrão
 */
class EstoqueService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.STOCK);
  }

  /**
   * Busca produtos com estoque baixo
   * @returns {Promise} Promise com produtos em estoque baixo
   */
  async getLowStock() {
    return this.customGet('baixo');
  }

  /**
   * Busca itens críticos (estoque muito baixo)
   * @returns {Promise} Promise com itens críticos
   */
  async getCriticalItems() {
    return this.customGet('criticos');
  }

  /**
   * Registra entrada de estoque
   * @param {string|number} produtoId - ID do produto
   * @param {Object} data - Dados da entrada (quantidade, data, etc)
   * @returns {Promise} Promise com resultado
   */
  async registrarEntrada(produtoId, data) {
    return this.customPost(`${produtoId}/entrada`, data);
  }

  /**
   * Registra saída de estoque
   * @param {string|number} produtoId - ID do produto
   * @param {Object} data - Dados da saída (quantidade, data, etc)
   * @returns {Promise} Promise com resultado
   */
  async registrarSaida(produtoId, data) {
    return this.customPost(`${produtoId}/saida`, data);
  }

  /**
   * Busca histórico de movimentações
   * @param {string|number} produtoId - ID do produto
   * @returns {Promise} Promise com histórico
   */
  async getHistorico(produtoId) {
    return this.customGet(`${produtoId}/historico`);
  }

  /**
   * Busca produtos por categoria
   * @param {string} categoria - Categoria do produto
   * @returns {Promise} Promise com produtos da categoria
   */
  async getByCategoria(categoria) {
    return this.customGet('', {
      params: { categoria }
    });
  }

  /**
   * Inativa produto
   * @param {string|number} id - ID do produto
   * @returns {Promise} Promise com resultado
   */
  async inativar(id) {
    return this.patch(id, { ativo: false });
  }

  /**
   * Ativa produto
   * @param {string|number} id - ID do produto
   * @returns {Promise} Promise com resultado
   */
  async ativar(id) {
    return this.patch(id, { ativo: true });
  }
}

// Exporta instância singleton
export const estoqueService = new EstoqueService();
export default estoqueService;
