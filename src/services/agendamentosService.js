import apiClient from "../core/api/axios.config";

export const agendamentosService = {
  create: async (agendamento) => {
    try {
      const response = await apiClient.post("/agendamentos", agendamento);
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get("/agendamentos");
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(` Deletando agendamento ${id}...`);
      const response = await apiClient.delete(`/agendamentos/${id}`);
      console.log(` Agendamento ${id} deletado com sucesso`);
      return response.data;
    } catch (error) {
      console.error(` Erro ao deletar agendamento ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default agendamentosService;
