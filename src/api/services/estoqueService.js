import { Api, EtlApi } from "../client/Api";
import BaseService from '../client/BaseService';

/**
 * Service para gerenciamento de estoque
 * Estende BaseService para herdar métodos CRUD padrão
 */
class EstoqueService extends BaseService {
  constructor() {
    super(Api);
  }

  /**
   * Busca todos os itens de estoque
   * @returns {Promise} Promise com lista de estoque
   */
  getAll() {
    return this.get("/estoques");
  }

  /**
   * Busca estoque por ID
   * @param {string|number} id - ID do estoque
   * @returns {Promise} Promise com dados do estoque
   */
  getById(id) {
    return this.get(`/estoques/${id}`);
  }

  /**
   * Busca produtos com estoque baixo
   * @returns {Promise} Promise com produtos em estoque baixo
   */
  getLowStock() {
    return this.get("/estoques/baixo");
  }

  /**
   * Busca itens críticos (estoque muito baixo)
   * @returns {Promise} Promise com itens críticos
   */
  getCriticalItems() {
    return this.get("/estoques/criticos");
  }

  /**
   * Registra entrada de estoque
   * @param {Object} data - Dados da entrada (produtoId, quantidade, localizacao, etc)
   * @returns {Promise} Promise com resultado
   */
  registrarEntrada(data) {
    return this.post("/estoques/entrada", data);
  }

  /**
   * Registra saída de estoque
   * @param {Object} data - Dados da saída (produtoId, quantidade, etc)
   * @returns {Promise} Promise com resultado
   */
  registrarSaida(data) {
    return this.post("/estoques/saida", data);
  }

  /**
   * Busca histórico de movimentações
   * @param {string|number} produtoId - ID do produto
   * @returns {Promise} Promise com histórico
   */
  getHistorico(produtoId) {
    return this.get(`/estoques/${produtoId}/historico`);
  }

  /**
   * Busca produtos por categoria
   * @param {string} categoria - Categoria do produto
   * @returns {Promise} Promise com produtos da categoria
   */
  getByCategoria(categoria) {
    return this.get("/estoques", { params: { categoria } });
  }

  /**
   * Atualiza dados de um item de estoque
   * @param {string|number} id - ID do item de estoque
   * @param {Object} data - Dados atualizados do item
   * @returns {Promise} Promise com dados atualizados
   */
  update(id, data) {
    return this.put(`/estoques/${id}`, data);
  }

  /**
   * Remove um item de estoque
   * @param {string|number} id - ID do item de estoque
   * @returns {Promise} Promise com resultado da operação
   */
  delete(id) {
    return this.delete(`/estoques/${id}`);
  }

  importarPlanilha(arquivo) {
    const formData = new FormData();
    formData.append("file", arquivo);

    return this.post("/estoques/importar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Exporta estoque para Excel via microservice
   * Chama diretamente o microserviço na porta 3001
   * O cookie httpOnly é enviado automaticamente via withCredentials
   * @returns {Promise} Promise com blob do arquivo Excel
   */
  async exportToExcel() {
    try {
      const response = await EtlApi.get(`/export/estoque`, {
        responseType: 'blob',
        withCredentials: true, // Envia cookies automaticamente (incluindo authToken httpOnly)
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Erro ao exportar planilha de estoque:", error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ??
          error.message ??
          "Erro ao exportar planilha",
        status: error.response?.status,
      };
    }
  }
}

// Exporta instância singleton
export const estoqueService = new EstoqueService();
export default estoqueService;
