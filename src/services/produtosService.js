import { BaseService } from "../core/services/BaseService";

class ProdutosService extends BaseService {
  constructor() {
    super("/produtos");
  }

  /**
   * Buscar produtos por categoria
   * @param {string} categoria - Categoria do produto
   * @returns {Promise<Object>} Promise com resultado
   */
  async buscarPorCategoria(categoria) {
    return this.customGet("/categoria", { categoria });
  }

  /**
   * Buscar produtos ativos
   * @returns {Promise<Object>} Promise com resultado
   */
  async buscarAtivos() {
    return this.customGet("/ativos");
  }

  /**
   * Buscar produtos com estoque baixo
   * @returns {Promise<Object>} Promise com resultado
   */
  async buscarEstoqueBaixo() {
    return this.customGet("/estoque-baixo");
  }
}

export const produtosService = new ProdutosService();
export default produtosService;
