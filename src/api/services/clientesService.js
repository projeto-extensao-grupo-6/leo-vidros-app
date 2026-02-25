import Api, { EtlApi } from "../client/Api";
import BaseService from "../client/BaseService";

class ClientesService extends BaseService {
  constructor() {
    super(Api);
  }

  getAll() {
    return this.get("/clientes");
  }

  getById(id) {
    return this.get(`/clientes/${id}`);
  }

  create(cliente) {
    return this.post("/clientes", cliente);
  }

  update(id, cliente) {
    return this.put(`/clientes/${id}`, cliente);
  }

  delete(id) {
    return super.delete(`/clientes/${id}`);
  }

  /**
   * Realiza a importação de clientes via arquivo Excel.
   * @param {File} arquivo - O arquivo selecionado no input (e.target.files[0])
   */
  importarPlanilha(arquivo) {
    const formData = new FormData();
    // 'file' é o nome padrão esperado pelo Spring Boot para MultipartFile,
    // verifique se o backend espera outro nome (ex: 'arquivo')
    formData.append("file", arquivo);

    return this._handle(
      EtlApi.post("/excel/import/clientes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    );
  }
}

export const clientesService = new ClientesService();
export default clientesService;
