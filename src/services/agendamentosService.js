const API_BASE_URL = "http://localhost:3000/api";

export const agendamentosService = {
  create: async (agendamento) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamento),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar agendamento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar agendamentos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar agendamento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },
};