import apiClient from "../core/api/axios.config";

const API_DASHBOARD = "/dashboard";

export const getQtdItensCriticos = () => {
    return apiClient.get(`${API_DASHBOARD}/qtd-itens-criticos`);
}

export const getQtdAgendamentosHoje = () => {
    return apiClient.get(`${API_DASHBOARD}/qtd-agendamentos-hoje`);
}

export const getTaxaOcupacaoServicos = async () => {
    try {
        const response = await apiClient.get(`${API_DASHBOARD}/taxa-ocupacao-servicos`);
        // Se a taxa de ocupação for null, retorna 0
        if (response.data === null || response.data === undefined || response.data.taxaOcupacaoServicos === null || response.data.taxaOcupacaoServicos === undefined) {
            return { ...response, data: { ...response.data, taxaOcupacaoServicos: 0 } };
        }
        return response;
    } catch (error) {
        throw error;
    }
}

export const getQtdAgendamentosFuturos = () => {
    return apiClient.get(`${API_DASHBOARD}/qtd-agendamentos-futuros`);
}

export const getEstoqueCritico = () => {
    return apiClient.get(`${API_DASHBOARD}/estoque-critico`);
}

export const getAgendamentosFuturos = () => {
    return apiClient.get(`${API_DASHBOARD}/agendamentos-futuros`);
}

export const getQtdServicosHoje = () => {
    return apiClient.get(`${API_DASHBOARD}/qtd-servicos-hoje`);
}
