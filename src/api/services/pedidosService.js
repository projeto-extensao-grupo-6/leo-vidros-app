import Api from '../client/Api';
import BaseService from '../client/BaseService';

/**
 * Service de Pedidos (produtos e serviços) — estende BaseService.
 *
 * Além das operações CRUD padrão, fornece:
 *  - `mapearParaBackend(dados)` → converte o modelo do frontend para o PedidoRequestDto.
 *  - `mapearParaFrontend(dados)` → normaliza a resposta do backend, calculando
 *    etapa atual e progresso com base nos agendamentos ativos do serviço.
 *  - `filtrarPedidos` / `filtrarServicos` → filtragem local (status, etapa, busca textual).
 */
class PedidosService extends BaseService {
    constructor() {
        super(Api);
    }
    
    /** Retorna todos os pedidos (produtos e serviços). */
    async buscarTodos() {
        const result = await this.get('/pedidos');
        if (result.success) result.data = result.data || [];
        return result;
    }

    /** Retorna apenas os pedidos do tipo serviço. */
    async buscarPedidosDeServico() {
        const result = await this.get('/pedidos/servicos');
        if (result.success) result.data = result.data || [];
        return result;
    }

    /** Retorna apenas os pedidos do tipo produto. */
    async buscarPedidosDeProduto() {
        const result = await this.get('/pedidos/produtos');
        if (result.success) result.data = result.data || [];
        return result;
    }

    /**
     * Retorna um pedido pelo ID.
     * @param {number|string} id
     */
    buscarPorId(id) {
        return this.get(`/pedidos/${id}`);
    }

    /**
     * Retorna pedidos filtrados por etapa.
     * @param {string} nomeEtapa - Nome da etapa (ex.: 'PENDENTE', 'CONCLUÍDO')
     */
    async buscarPorTipoAndEtapa(nomeEtapa) {
        const result = await this.get('/pedidos/findAllBy', { params: { nome: nomeEtapa } });
        if (result.success) result.data = result.data || [];
        return result;
    }

    /**
     * Cria um novo pedido.
     * @param {{ pedido: object, servico?: object, produtos?: object[] }} pedidoData - Payload no formato PedidoRequestDto
     */
    async criarPedido(pedidoData) {
        if (!pedidoData.pedido) {
            return { success: false, data: null, error: 'Dados do pedido são obrigatórios', status: 400 };
        }
        const result = await this.post('/pedidos', pedidoData);
        if (!result.success) result.validationErrors = {};
        return result;
    }

    /**
     * Atualiza um pedido existente pelo ID.
     * @param {number|string} id
     * @param {object} pedidoData - Campos a atualizar
     */
    async atualizarPedido(id, pedidoData) {
        const result = await this.put(`/pedidos/${id}`, pedidoData);
        if (!result.success) result.validationErrors = {};
        return result;
    }

    /**
     * Alias de `atualizarPedido` — exposto para uso semântico em contextos de serviço.
     * @param {number|string} id
     * @param {object} pedidoData
     */
    async atualizarServico(id, pedidoData) {
        return this.atualizarPedido(id, pedidoData);
    }

    /**
     * Remove um pedido pelo ID.
     * @param {number|string} id
     */
    deletarPedido(id) {
        return this.delete(`/pedidos/${id}`);
    }

    /**
     * Alias de `deletarPedido` — exposto para uso semântico em contextos de serviço.
     * @param {number|string} id
     */
    async deletarServico(id) {
        return this.deletarPedido(id);
    }

    /**
     * Converte os dados do frontend para o formato PedidoRequestDto esperado pelo backend.
     * Determina automaticamente se o payload deve incluir `servico` ou `produtos`
     * com base em `dadosFrontend.tipo` / `dadosFrontend.tipoPedido`.
     * @param {object} dadosFrontend
     * @returns {{ pedido: object, servico: object|null, produtos: object[]|null }}
     */
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

    /**
     * Normaliza a resposta do backend para o modelo utilizado no frontend.
     *
     * Para pedidos do tipo serviço, calcula a `etapa` atual comparando os
     * agendamentos ativos (excluindo CANCELADO/INATIVO) e aplica a lógica
     * de progressão de etapas (PENDENTE → CONCLUÍDO).
     *
     * @param {object} dadosBackend - Objeto bruto retornado pela API
     * @returns {object} Pedido normalizado com campos `etapa`, `progresso`, `servico`, etc.
     */
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
        let progressoTotal = 7;
        
        // CORREÇÃO: Declarar etapaCalculada FORA do if para ser acessível no return
        let etapaCalculada = 'PENDENTE';

        if (isServico && dadosBackend.servico) {
            // Etapa original do backend
            const etapaNome = dadosBackend.servico.etapa?.nome || 'PENDENTE';
            
            // Inicia com o valor do backend
            etapaCalculada = etapaNome;
            
            // Filtra apenas agendamentos VÁLIDOS (não cancelados/deletados)
            const agendamentosTodos = dadosBackend.servico.agendamentos || [];
            const agendamentosAtivos = agendamentosTodos.filter(ag => 
                ag.statusAgendamento?.nome && 
                ag.statusAgendamento.nome !== 'CANCELADO' && 
                ag.statusAgendamento.nome !== 'INATIVO'
            );
            
            // Se tiver agendamentos ATIVOS, calculamos a etapa baseada neles
            if (agendamentosAtivos.length > 0) {
                const agendamentoOrcamento = agendamentosAtivos.find(
                    ag => ag.tipoAgendamento === 'ORCAMENTO'
                );
                const agendamentoServico = agendamentosAtivos.find(
                    ag => ag.tipoAgendamento === 'SERVICO'
                );

                // 1. Prioridade: Serviço (tem agendamento de serviço)
                if (agendamentoServico) {
                    const statusServico = agendamentoServico.statusAgendamento?.nome;
                    if (statusServico === 'CONCLUÍDO') etapaCalculada = 'CONCLUÍDO';
                    else if (statusServico === 'EM ANDAMENTO') etapaCalculada = 'SERVIÇO EM EXECUÇÃO';
                    else etapaCalculada = 'SERVIÇO AGENDADO'; // PENDENTE
                } 
                // 2. Prioridade: Orçamento (tem agendamento de orçamento, mas NÃO tem serviço)
                else if (agendamentoOrcamento) {
                    const statusOrcamento = agendamentoOrcamento.statusAgendamento?.nome;
                    
                    // Se orçamento está CONCLUÍDO → ANÁLISE DO ORÇAMENTO (etapa 3)
                    // A etapa 4 (ORÇAMENTO APROVADO) só vem manualmente pelo usuário
                    if (statusOrcamento === 'CONCLUÍDO') {
                        // Verifica se o backend já tem ORÇAMENTO APROVADO (mudança manual)
                        if (etapaNome === 'ORÇAMENTO APROVADO') {
                            etapaCalculada = 'ORÇAMENTO APROVADO';
                        } else {
                            etapaCalculada = 'ANÁLISE DO ORÇAMENTO';
                        }
                    }
                    else if (statusOrcamento === 'EM ANDAMENTO' || statusOrcamento === 'PENDENTE') {
                        etapaCalculada = 'AGUARDANDO ORÇAMENTO';
                    }
                }
            } else {
                // SEM AGENDAMENTOS ATIVOS → FORÇA PENDENTE
                etapaCalculada = 'PENDENTE';
            }
            
            servicoInfo = {
                id: dadosBackend.servico.id,
                codigo: dadosBackend.servico.codigo,
                nome: dadosBackend.servico.nome || 'Serviço sem nome',
                descricao: dadosBackend.servico.descricao || '',
                precoBase: dadosBackend.servico.precoBase || 0,
                ativo: dadosBackend.servico.ativo,
                etapa: etapaCalculada, // Usa a etapa calculada
                agendamentos: agendamentosTodos // Mantém todos no histórico
            };
            
            produtosDesc = servicoInfo.nome;
            itensCount = 1;
            
            // Mapear para texto amigável e valor da barra de progresso
            switch (etapaCalculada.toUpperCase()) {
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
                    etapaAtual = etapaCalculada;
                    progressoValor = 1;
            }
        }

        const statusNome = dadosBackend.status?.nome || 'Ativo';
        let statusMapeado = statusNome;
        
        switch (statusNome.toUpperCase()) {
            case 'ATIVO': statusMapeado = 'Ativo'; break;
            case 'FINALIZADO': statusMapeado = 'Finalizado'; break;
            case 'PENDENTE': statusMapeado = 'Em Andamento'; break;
            case 'CANCELADO': statusMapeado = 'Cancelado'; break;
            default: statusMapeado = statusNome;
        }

        let dataCompra = dadosBackend.dataCompra;
        if (!dataCompra && dadosBackend.servico?.createdAt) {
            const createdDate = new Date(dadosBackend.servico.createdAt);
            dataCompra = createdDate.toISOString().slice(0, 10);
        }
        if (!dataCompra) {
            dataCompra = new Date().toISOString().slice(0, 10);
        }

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
            
            // Dados calculados para o modal e barra de progresso
            etapa: etapaAtual,
            // Agora etapaOriginal vai receber etapaCalculada, que está no escopo correto
            etapaOriginal: isServico ? etapaCalculada : null, 
            progresso: [progressoValor, progressoTotal],
            servicoNome: servicoInfo?.nome || null,
            
            produtos: produtos,
            servico: servicoInfo,
            
            observacoes: dadosBackend.descricao || '',
            statusOriginal: dadosBackend.status
        };
    }

    /**
     * Filtra uma lista de pedidos pelo status, forma de pagamento, etapa e busca textual.
     * Recebe os pedidos já mapeados por `mapearParaFrontend`.
     * @param {object[]} pedidos
     * @param {{ status?: string|string[], pagamento?: string|string[], etapa?: string|string[], busca?: string }} filtros
     * @returns {object[]}
     */
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

    /**
     * Filtra uma lista de serviços pelo status, etapa e busca textual.
     * @param {object[]} servicos
     * @param {{ status?: string|string[], etapa?: string|string[], busca?: string }} filtros
     * @returns {object[]}
     */
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