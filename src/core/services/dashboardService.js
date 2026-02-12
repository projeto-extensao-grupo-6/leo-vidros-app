import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../api/endpoints';
import apiClient from '../api/axios.config';

/**
 * Service para métricas do dashboard
 * Extende BaseService para métodos customizados de relatórios
 */
class DashboardService extends BaseService {
    constructor() {
        super(API_ENDPOINTS.DASHBOARD);
    }

    /**
     * Obtém quantidade de itens críticos no estoque
     * @returns {Promise} Quantidade de itens críticos
     */
    async getQtdItensCriticos() {
        return apiClient.get(`${this.endpoint}/qtd-itens-criticos`);
    }

    /**
     * Obtém quantidade de agendamentos para hoje
     * @returns {Promise} Quantidade de agendamentos hoje
     */
    async getQtdAgendamentosHoje() {
        return apiClient.get(`${this.endpoint}/qtd-agendamentos-hoje`);
    }

    /**
     * Obtém taxa de ocupação de serviços
     * @returns {Promise} Taxa de ocupação (0-100)
     */
    async getTaxaOcupacaoServicos() {
        try {
            const response = await apiClient.get(`${this.endpoint}/taxa-ocupacao-servicos`);
            
            // Se a taxa de ocupação for null, retorna 0
            if (response.data === null || 
                response.data === undefined || 
                response.data.taxaOcupacaoServicos === null || 
                response.data.taxaOcupacaoServicos === undefined) {
                return { ...response, data: { ...response.data, taxaOcupacaoServicos: 0 } };
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtém quantidade de agendamentos futuros
     * @returns {Promise} Quantidade de agendamentos futuros
     */
    async getQtdAgendamentosFuturos() {
        return apiClient.get(`${this.endpoint}/qtd-agendamentos-futuros`);
    }

    /**
     * Obtém lista de itens em estoque crítico
     * @returns {Promise} Lista de itens críticos
     */
    async getEstoqueCritico() {
        return apiClient.get(`${this.endpoint}/estoque-critico`);
    }

    /**
     * Obtém lista de agendamentos futuros
     * @returns {Promise} Lista de agendamentos futuros
     */
    async getAgendamentosFuturos() {
        return apiClient.get(`${this.endpoint}/agendamentos-futuros`);
    }

    /**
     * Obtém quantidade de serviços para hoje
     * @returns {Promise} Quantidade de serviços hoje
     */
    async getQtdServicosHoje() {
        return apiClient.get(`${this.endpoint}/qtd-servicos-hoje`);
    }
}

// Criar instância e exportar métodos como funções nomeadas para compatibilidade
const dashboardServiceInstance = new DashboardService();

export const getQtdItensCriticos = () => dashboardServiceInstance.getQtdItensCriticos();
export const getQtdAgendamentosHoje = () => dashboardServiceInstance.getQtdAgendamentosHoje();
export const getTaxaOcupacaoServicos = () => dashboardServiceInstance.getTaxaOcupacaoServicos();
export const getQtdAgendamentosFuturos = () => dashboardServiceInstance.getQtdAgendamentosFuturos();
export const getEstoqueCritico = () => dashboardServiceInstance.getEstoqueCritico();
export const getAgendamentosFuturos = () => dashboardServiceInstance.getAgendamentosFuturos();
export const getQtdServicosHoje = () => dashboardServiceInstance.getQtdServicosHoje();

export default dashboardServiceInstance;
