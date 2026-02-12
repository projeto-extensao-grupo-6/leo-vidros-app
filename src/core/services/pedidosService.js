import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../api/endpoints';

/**
 * Service para gerenciamento de pedidos e serviços
 * Extende BaseService para herdar métodos CRUD padrão
 */
class PedidosService extends BaseService {
    constructor() {
        super(API_ENDPOINTS.ORDERS);
    }

    /**
     * Busca todos os pedidos
     * @returns {Promise} Lista de pedidos
     */
    async buscarTodos() {
        return this.getAll();
    }

    /**
     * Busca pedidos de serviço
     * @returns {Promise} Lista de pedidos de serviço
     */
    async buscarPedidosDeServico() {
        return this.customGet('servicos');
    }

    /**
     * Busca pedidos de produto
     * @returns {Promise} Lista de pedidos de produto
     */
    async buscarPedidosDeProduto() {
        return this.customGet('produtos');
    }

    /**
     * Busca pedido por ID
     * @param {string|number} id - ID do pedido
     * @returns {Promise} Pedido encontrado
     */
    async buscarPorId(id) {
        return this.getById(id);
    }

    /**
     * Busca pedidos por tipo e etapa
     * @param {string} nomeEtapa - Nome da etapa
     * @returns {Promise} Lista de pedidos filtrados
     */
    async buscarPorTipoAndEtapa(nomeEtapa) {
        return this.customGet('findAllBy', {
            params: { nome: nomeEtapa }
        });
    }

    /**
     * Cria um novo pedido
     * @param {Object} pedidoData - Dados do pedido
     * @returns {Promise} Pedido criado
     */
    async criarPedido(pedidoData) {
        if (!pedidoData.pedido) {
            return {
                success: false,
                error: 'Dados do pedido são obrigatórios',
                validationErrors: {}
            };
        }
        
        const result = await this.create(pedidoData);
        
        // Adicionar validationErrors se houver
        if (!result.success && result.details?.errors) {
            result.validationErrors = result.details.errors;
        }
        
        return result;
    }

    /**
     * Atualiza um pedido existente
     * @param {string|number} id - ID do pedido
     * @param {Object} pedidoData - Dados atualizados
     * @returns {Promise} Pedido atualizado
     */
    async atualizarPedido(id, pedidoData) {
        const result = await this.update(id, pedidoData);
        
        // Adicionar validationErrors se houver
        if (!result.success && result.details?.errors) {
            result.validationErrors = result.details.errors;
        }
        
        return result;
    }

    /**
     * Atualiza um serviço (alias para atualizarPedido)
     * @param {string|number} id - ID do serviço
     * @param {Object} pedidoData - Dados atualizados
     * @returns {Promise} Serviço atualizado
     */
    async atualizarServico(id, pedidoData) {
        return this.atualizarPedido(id, pedidoData);
    }

    /**
     * Deleta um pedido
     * @param {string|number} id - ID do pedido
     * @returns {Promise} Resultado da operação
     */
    async deletarPedido(id) {
        return this.delete(id);
    }

    /**
     * Deleta um serviço (alias para deletarPedido)
     * @param {string|number} id - ID do serviço
     * @returns {Promise} Resultado da operação
     */
    async deletarServico(id) {
        return this.deletarPedido(id);
    }

    mapearParaBackend(dadosFrontend) {
        const pedidoBase = {
            valorTotal: dadosFrontend.valorTotal || 0,
            ativo: dadosFrontend.ativo !== false,
            observacao: dadosFrontend.descricao || dadosFrontend.observacoes || '',
            formaPagamento: dadosFrontend.formaPagamento || 'Pix',
            cliente: dadosFrontend.clienteId ? { id: dadosFrontend.clienteId } : null,
            status: {
                tipo: 'PEDIDO',
                nome: dadosFrontend.status || 'Ativo'
            }
        };

        const pedidoRequest = {
            pedido: pedidoBase,
            servico: null,
            produtos: null
        };

        if (dadosFrontend.tipo === 'SERVICO' || dadosFrontend.tipoPedido === 'servico') {
            if (dadosFrontend.servicos && dadosFrontend.servicos.length > 0) {
                const primeiroServico = dadosFrontend.servicos[0];
                pedidoRequest.servico = {
                    nome: primeiroServico.nome || 'Serviço',
                    descricao: dadosFrontend.descricao || primeiroServico.descricao || '',
                    precoBase: primeiroServico.preco || dadosFrontend.valorTotal || 0,
                    ativo: true,
                    etapa: primeiroServico.etapa || null
                };
            }
        }

        else if (dadosFrontend.tipo === 'PRODUTO' || dadosFrontend.tipoPedido === 'produto') {
            if (dadosFrontend.produtos && dadosFrontend.produtos.length > 0) {
                pedidoRequest.produtos = dadosFrontend.produtos.map(produto => ({
                    estoqueId: produto.produtoId || produto.estoqueId,
                    quantidadeSolicitada: produto.quantidade || 1,
                    precoUnitarioNegociado: produto.preco || 0,
                    observacao: produto.observacao || ''
                }));
            }
        }

        return pedidoRequest;
    }

    mapearParaFrontend(dadosBackend) {
        const isProduto = dadosBackend.tipoPedido === 'produto' && dadosBackend.produtos && dadosBackend.produtos.length > 0;
        const isServico = dadosBackend.tipoPedido === 'serviço' && dadosBackend.servico;

        let produtosDesc = '';
        let itensCount = 0;
        let produtos = [];

        if (isProduto && dadosBackend.produtos) {
            produtos = dadosBackend.produtos.map(produto => ({
                nome: produto.nomeProduto || 'Produto',
                quantidade: produto.quantidadeSolicitada || 0,
                preco: produto.precoUnitarioNegociado || 0,
                estoqueId: produto.estoqueId,
                subtotal: produto.subtotal || 0,
                observacao: produto.observacao || ''
            }));
            
            produtosDesc = produtos.map(p => p.nome).join(', ');
            itensCount = produtos.length;
        }

        let servicoInfo = null;
        let etapaAtual = 'Aguardando orçamento';
        let progressoValor = 1;
        let progressoTotal = 6;
        
        if (isServico && dadosBackend.servico) {
            // Corrigir o mapeamento da etapa - agora vem de servico.etapa.nome
            const etapaNome = dadosBackend.servico.etapa?.nome || 'PENDENTE';
            
            servicoInfo = {
                id: dadosBackend.servico.id,
                codigo: dadosBackend.servico.codigo,
                nome: dadosBackend.servico.nome || 'Serviço sem nome',
                descricao: dadosBackend.servico.descricao || '',
                precoBase: dadosBackend.servico.precoBase || 0,
                ativo: dadosBackend.servico.ativo,
                etapa: etapaNome
            };
            
            // Usar o nome do serviço como descrição principal
            produtosDesc = servicoInfo.nome;
            itensCount = 1;
            
            // Mapear etapa para nome amigável e progresso
            switch (etapaNome.toUpperCase()) {
                case 'PENDENTE':
                    etapaAtual = 'Pendente';
                    progressoValor = 1;
                    break;
                case 'AGUARDANDO ORÇAMENTO':
                    etapaAtual = 'Aguardando Orçamento';
                    progressoValor = 2;
                    break;
                case 'ANÁLISE DO ORÇAMENTO':
                    etapaAtual = 'Análise do Orçamento';
                    progressoValor = 3;
                    break;
                case 'ORÇAMENTO APROVADO':
                    etapaAtual = 'Orçamento Aprovado';
                    progressoValor = 4;
                    break;
                case 'SERVIÇO AGENDADO':
                    etapaAtual = 'Serviço Agendado';
                    progressoValor = 5;
                    break;
                case 'SERVIÇO EM EXECUÇÃO':
                    etapaAtual = 'Serviço em Execução';
                    progressoValor = 6;
                    break;
                case 'CONCLUÍDO':
                    etapaAtual = 'Concluído';
                    progressoValor = 7;
                    break;
                case 'CANCELADO':
                    etapaAtual = 'Cancelado';
                    progressoValor = 0;
                    break;
                default:
                    etapaAtual = etapaNome;
                    progressoValor = 1;
            }
        }

        const statusNome = dadosBackend.status?.nome || 'Ativo';
        let statusMapeado = statusNome;
        
        switch (statusNome.toUpperCase()) {
            case 'ATIVO':
                statusMapeado = 'Ativo';
                break;
            case 'FINALIZADO':
                statusMapeado = 'Finalizado';
                break;
            case 'PENDENTE':
                statusMapeado = 'Em Andamento';
                break;
            case 'CANCELADO':
                statusMapeado = 'Cancelado';
                break;
            default:
                statusMapeado = statusNome;
        }

        let dataCompra = dadosBackend.dataCompra;
        if (!dataCompra && dadosBackend.servico?.createdAt) {
            const createdDate = new Date(dadosBackend.servico.createdAt);
            dataCompra = createdDate.toISOString().slice(0, 10);
        }
        if (!dataCompra) {
            dataCompra = new Date().toISOString().slice(0, 10);
        }

        // Garantir que o cliente seja "Não informado" quando não existe ou está vazio
        const clienteNome = dadosBackend.cliente?.nome;
        const clienteNomeFinal = (clienteNome && clienteNome.trim()) ? clienteNome : 'Não informado';

        return {
            id: dadosBackend.id,
            clienteNome: clienteNomeFinal,
            clienteId: dadosBackend.cliente?.id,
            clienteInfo: {
                nome: clienteNomeFinal,
                cpf: dadosBackend.cliente?.cpf || '',
                email: dadosBackend.cliente?.email || '',
                telefone: dadosBackend.cliente?.telefone || '',
                endereco: dadosBackend.cliente?.enderecos?.[0] || null
            },
            produtosDesc: produtosDesc || (isProduto ? 'Produtos não especificados' : 'Serviço não especificado'),
            descricao: dadosBackend.descricao || dadosBackend.servico?.descricao || '',
            dataCompra: dataCompra,
            data: dataCompra,
            formaPagamento: dadosBackend.formaPagamento || 'Não informado',
            itensCount: itensCount,
            valorTotal: dadosBackend.valorTotal || 0,
            status: statusMapeado,
            ativo: dadosBackend.ativo !== false,
            tipoPedido: dadosBackend.tipoPedido || (isProduto ? 'produto' : 'servico'),
            
            // Para serviços, adicionar campos específicos
            etapa: etapaAtual,
            etapaOriginal: isServico ? dadosBackend.servico.etapa?.nome : null, // Manter etapa original para edição
            progresso: [progressoValor, progressoTotal],
            servicoNome: servicoInfo?.nome || null,
            
            produtos: produtos,
            servico: servicoInfo,
            
            observacoes: dadosBackend.descricao || '',
            statusOriginal: dadosBackend.status
        };
    }

    filtrarPedidos(pedidos, filtros = {}) {
        let pedidosFiltrados = [...pedidos];

        if (filtros.status && filtros.status !== "Todos" && filtros.status.length > 0) {
            const statusArray = Array.isArray(filtros.status) ? filtros.status : [filtros.status];
            if (!statusArray.includes("Todos")) {
                pedidosFiltrados = pedidosFiltrados.filter(pedido => 
                    statusArray.includes(pedido.status)
                );
            }
        }

        if (filtros.pagamento && filtros.pagamento !== "Todos" && filtros.pagamento.length > 0) {
            const pagamentoArray = Array.isArray(filtros.pagamento) ? filtros.pagamento : [filtros.pagamento];
            if (!pagamentoArray.includes("Todos")) {
                pedidosFiltrados = pedidosFiltrados.filter(pedido => 
                    pagamentoArray.includes(pedido.formaPagamento)
                );
            }
        }

        if (filtros.etapa && filtros.etapa !== "Todos" && filtros.etapa.length > 0) {
            const etapaArray = Array.isArray(filtros.etapa) ? filtros.etapa : [filtros.etapa];
            if (!etapaArray.includes("Todos")) {
                pedidosFiltrados = pedidosFiltrados.filter(pedido => 
                    pedido.servico && etapaArray.includes(pedido.servico.etapa?.nome)
                );
            }
        }

        if (filtros.busca && filtros.busca.trim()) {
            const termoBusca = filtros.busca.toLowerCase().trim();
            pedidosFiltrados = pedidosFiltrados.filter(pedido =>
                [
                    pedido.id?.toString().padStart(3, '0'),
                    pedido.clienteNome,
                    pedido.produtosDesc,
                    pedido.descricao,
                    pedido.formaPagamento
                ].join(' ').toLowerCase().includes(termoBusca)
            );
        }

        return pedidosFiltrados;
    }

    filtrarServicos(servicos, filtros = {}) {
        let servicosFiltrados = [...servicos];

        if (filtros.status && filtros.status !== "Todos" && filtros.status.length > 0) {
            const statusArray = Array.isArray(filtros.status) ? filtros.status : [filtros.status];
            if (!statusArray.includes("Todos")) {
                servicosFiltrados = servicosFiltrados.filter(servico => 
                    statusArray.includes(servico.status)
                );
            }
        }

        if (filtros.etapa && filtros.etapa !== "Todos" && filtros.etapa.length > 0) {
            const etapaArray = Array.isArray(filtros.etapa) ? filtros.etapa : [filtros.etapa];
            if (!etapaArray.includes("Todos")) {
                servicosFiltrados = servicosFiltrados.filter(servico => 
                    etapaArray.includes(servico.etapa)
                );
            }
        }

        if (filtros.busca && filtros.busca.trim()) {
            const termoBusca = filtros.busca.toLowerCase().trim();
            servicosFiltrados = servicosFiltrados.filter(servico =>
                [
                    servico.id?.toString().padStart(3, '0'),
                    servico.clienteNome,
                    servico.descricao,
                    servico.etapa,
                    servico.servicoNome,
                    servico.produtosDesc
                ].join(' ').toLowerCase().includes(termoBusca)
            );
        }

        return servicosFiltrados;
    }
}

export default new PedidosService();