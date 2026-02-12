import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../api/endpoints';

/**
 * Serviço para integração com API de Serviços do backend Spring
 * Extende BaseService e utiliza o endpoint de pedidos, filtrando por serviços
 */
class ServicosService extends BaseService {
    constructor() {
        super(API_ENDPOINTS.ORDERS);
    }

    /**
     * Buscar todos os serviços (pedidos do tipo serviço)
     * @returns {Promise} Lista de serviços
     */
    async buscarTodos() {
        const result = await this.getAll();
        
        if (result.success) {
            // Filtrar apenas pedidos que são serviços (têm campo servico preenchido)
            const servicos = result.data?.filter(pedido => pedido.servico) || [];
            return {
                ...result,
                data: servicos
            };
        }
        
        return result;
    }

    /**
     * Buscar serviço por ID
     * @param {string|number} id - ID do serviço
     * @returns {Promise} Serviço encontrado
     */
    async buscarPorId(id) {
        const result = await this.getById(id);
        
        if (result.success) {
            // Verificar se o pedido é um serviço
            if (!result.data.servico) {
                return {
                    success: false,
                    error: 'Este pedido não é um serviço',
                    status: 400
                };
            }
        }
        
        return result;
    }

    /**
     * Buscar serviços por etapa
     * @param {string} nomeEtapa - Nome da etapa
     * @returns {Promise} Lista de serviços filtrados
     */
    async buscarPorEtapa(nomeEtapa) {
        const result = await this.customGet('findAllBy', {
            params: { nome: nomeEtapa }
        });
        
        if (result.success) {
            // Filtrar apenas pedidos que são serviços
            const servicos = result.data?.filter(pedido => pedido.servico) || [];
            return {
                ...result,
                data: servicos
            };
        }
        
        return result;
    }

    /**
     * Criar novo serviço
     * @param {Object} servicoData - Dados do serviço
     * @returns {Promise} Serviço criado
     */
    async criarServico(servicoData) {
        if (!servicoData.servico) {
            return {
                success: false,
                error: 'Dados do serviço são obrigatórios',
                validationErrors: {}
            };
        }

        const result = await this.create(servicoData);
        
        // Adicionar validationErrors se houver
        if (!result.success && result.details?.errors) {
            result.validationErrors = result.details.errors;
        }
        
        return result;
    }

    /**
     * Atualizar serviço existente
     * @param {string|number} id - ID do serviço
     * @param {Object} servicoData - Dados atualizados
     * @returns {Promise} Serviço atualizado
     */
    async atualizarServico(id, servicoData) {
        const result = await this.update(id, servicoData);
        
        // Adicionar validationErrors se houver
        if (!result.success && result.details?.errors) {
            result.validationErrors = result.details.errors;
        }
        
        return result;
    }

    /**
     * Deletar serviço
     * @param {string|number} id - ID do serviço
     * @returns {Promise} Resultado da operação
     */
    async deletarServico(id) {
        return this.delete(id);
    }

    /**
     * Mapear dados do frontend para o formato esperado pelo backend
     */
    mapearParaBackend(dadosFrontend) {
        // Para serviços, usamos o mesmo formato do PedidoRequestDto
        const servicoRequest = {
            pedido: {
                dataCompra: dadosFrontend.data || new Date().toISOString().split('T')[0],
                valorTotal: dadosFrontend.valorTotal || 0,
                observacoes: dadosFrontend.descricao || '',
                cliente: dadosFrontend.clienteId ? { id: dadosFrontend.clienteId } : null,
                status: dadosFrontend.status ? { 
                    tipo: 'SERVICO', 
                    nome: dadosFrontend.status 
                } : null
            },
            servico: {
                nome: dadosFrontend.nome || 'Serviço',
                descricao: dadosFrontend.descricao || '',
                precoBase: dadosFrontend.precoBase || 0,
                ativo: dadosFrontend.ativo !== false,
                etapa: dadosFrontend.etapa ? {
                    nome: dadosFrontend.etapa
                } : null
            },
            produtos: [] // Serviços geralmente não têm produtos
        };

        return servicoRequest;
    }

    /**
     * Mapear dados do backend para o formato usado no frontend
     */
    mapearParaFrontend(dadosBackend) {
        // Calcular progresso baseado na etapa
        const progressoInfo = this.calcularProgresso(dadosBackend.servico?.etapa?.nome);
        
        return {
            id: dadosBackend.id,
            clienteId: dadosBackend.cliente?.id,
            clienteNome: dadosBackend.cliente?.nome || 'Cliente não informado',
            data: dadosBackend.dataCompra,
            descricao: dadosBackend.servico?.descricao || dadosBackend.observacoes || '',
            status: dadosBackend.status?.nome || 'Ativo',
            etapa: dadosBackend.servico?.etapa?.nome || 'Aguardando orçamento',
            progresso: [progressoInfo.atual, progressoInfo.total],
            valorTotal: dadosBackend.valorTotal || 0,
            observacoes: dadosBackend.observacoes || '',
            servico: {
                nome: dadosBackend.servico?.nome || 'Serviço',
                descricao: dadosBackend.servico?.descricao || '',
                precoBase: dadosBackend.servico?.precoBase || 0,
                ativo: dadosBackend.servico?.ativo !== false,
                etapa: dadosBackend.servico?.etapa
            }
        };
    }

    /**
     * Calcular progresso baseado na etapa do serviço
     */
    calcularProgresso(nomeEtapa) {
        const etapas = {
            'Aguardando orçamento': { atual: 1, total: 6 },
            'Orçamento aprovado': { atual: 2, total: 6 },
            'Aguardando peças': { atual: 2, total: 6 },
            'Execução em andamento': { atual: 4, total: 6 },
            'Aguardando aprovação': { atual: 5, total: 6 },
            'Concluído': { atual: 6, total: 6 },
            'Finalizado': { atual: 6, total: 6 }
        };

        return etapas[nomeEtapa] || { atual: 1, total: 6 };
    }

    /**
     * Filtrar serviços por múltiplos critérios
     */
    filtrarServicos(servicos, filtros = {}) {
        let servicosFiltrados = [...servicos];

        // Filtro por status
        if (filtros.status && filtros.status !== "Todos" && filtros.status.length > 0) {
            const statusArray = Array.isArray(filtros.status) ? filtros.status : [filtros.status];
            if (!statusArray.includes("Todos")) {
                servicosFiltrados = servicosFiltrados.filter(servico => 
                    statusArray.includes(servico.status)
                );
            }
        }

        // Filtro por etapa
        if (filtros.etapa && filtros.etapa !== "Todos" && filtros.etapa.length > 0) {
            const etapaArray = Array.isArray(filtros.etapa) ? filtros.etapa : [filtros.etapa];
            if (!etapaArray.includes("Todos")) {
                servicosFiltrados = servicosFiltrados.filter(servico => 
                    etapaArray.includes(servico.etapa)
                );
            }
        }

        // Filtro por busca textual
        if (filtros.busca && filtros.busca.trim()) {
            const termoBusca = filtros.busca.toLowerCase().trim();
            servicosFiltrados = servicosFiltrados.filter(servico =>
                [
                    servico.id?.toString().padStart(3, '0'),
                    servico.clienteNome,
                    servico.descricao,
                    servico.status,
                    servico.etapa
                ].join(' ').toLowerCase().includes(termoBusca)
            );
        }

        return servicosFiltrados;
    }

    /**
     * Obter lista de etapas disponíveis
     */
    getEtapasDisponiveis() {
        return [
            'Aguardando orçamento',
            'Orçamento aprovado', 
            'Aguardando peças',
            'Execução em andamento',
            'Aguardando aprovação',
            'Concluído'
        ];
    }

    /**
     * Obter lista de status disponíveis
     */
    getStatusDisponiveis() {
        return ['Ativo', 'Finalizado', 'Cancelado'];
    }
}

export default new ServicosService();