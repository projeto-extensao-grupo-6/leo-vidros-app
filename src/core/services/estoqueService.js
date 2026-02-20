import { BaseService } from '../../core/services/BaseService';
import { API_ENDPOINTS } from '../../core/api/endpoints';
import apiClient from '../api/axios.config';
import axios from 'axios';

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

  /**
   * Exporta estoque para Excel via microservice
   * Fluxo: Frontend → Microservice (GET /api/excel/export/estoque) → Monolith → gera .xlsx → download
   * @returns {Promise} Promise com blob do arquivo Excel
   */
  async exportToExcel() {
    try {
      const microserviceUrl = import.meta.env.VITE_MICROSERVICE_EXCEL_URL;
      const token = sessionStorage.getItem('accessToken');
      
      const response = await axios.get(`${microserviceUrl}/excel/export/estoque`, {
        responseType: 'blob',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
        }
      });
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, 'exportar planilha de estoque');
    }
  }
}

// Exporta instância singleton
export const estoqueService = new EstoqueService();
export default estoqueService;
