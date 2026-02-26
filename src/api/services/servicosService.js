import Api from "../client/Api";
import BaseService from "../client/BaseService";
import PedidosService from "./pedidosService";

/**
 * Serviço para integração com API de Serviços do backend Spring
 * Utiliza o mesmo endpoint de pedidos, mas filtra por serviços
 */
class ServicosService extends BaseService {
  constructor() {
    super(Api);
  }

  /**
   * Buscar todos os serviços (pedidos do tipo serviço)
   */
  async buscarTodos() {
    const result = await this.get("/Pedidos");
    if (result.success) {
      result.data = result.data?.filter((pedido) => pedido.servico) || [];
    }
    return result;
  }

  /**
   * Buscar serviço por ID
   */
  async buscarPorId(id) {
    const result = await this.get(`/Pedidos/${id}`);
    if (result.success && !result.data?.servico) {
      return {
        success: false,
        data: null,
        error: "Este pedido não é um serviço",
        status: 400,
      };
    }
    return result;
  }

  /**
   * Buscar serviços por etapa
   */
  async buscarPorEtapa(nomeEtapa) {
    const result = await this.get("/Pedidos/findAllBy", {
      params: { nome: nomeEtapa },
    });
    if (result.success) {
      result.data = result.data?.filter((pedido) => pedido.servico) || [];
    }
    return result;
  }

  /**
   * Criar novo serviço
   */
  async criarServico(servicoData) {
    if (!servicoData.servico) {
      return {
        success: false,
        data: null,
        error: "Dados do serviço são obrigatórios",
        status: 400,
      };
    }
    const result = await this.post("/Pedidos", servicoData);
    if (!result.success) result.validationErrors = {};
    return result;
  }

  /**
   * Atualizar serviço existente
   */
  async atualizarServico(id, servicoData) {
    const result = await this.put(`/Pedidos/${id}`, servicoData);
    if (!result.success) result.validationErrors = {};
    return result;
  }

  /**
   * Deletar serviço
   */
  deletarServico(id) {
    return this.delete(`/Pedidos/${id}`);
  }

  /**
   * Mapear dados do frontend para o formato esperado pelo backend
   */
  mapearParaBackend(dadosFrontend) {
    // Para serviços, usamos o mesmo formato do PedidoRequestDto
    const servicoRequest = {
      pedido: {
        dataCompra:
          dadosFrontend.data || new Date().toISOString().split("T")[0],
        valorTotal: dadosFrontend.valorTotal || 0,
        observacoes: dadosFrontend.descricao || "",
        cliente: dadosFrontend.clienteId
          ? { id: dadosFrontend.clienteId }
          : null,
        status: dadosFrontend.status
          ? {
              tipo: "SERVICO",
              nome: dadosFrontend.status,
            }
          : null,
      },
      servico: {
        nome: dadosFrontend.nome || "Serviço",
        descricao: dadosFrontend.descricao || "",
        precoBase: dadosFrontend.precoBase || 0,
        ativo: dadosFrontend.ativo !== false,
        etapa: dadosFrontend.etapa
          ? {
              nome: dadosFrontend.etapa,
            }
          : null,
      },
      produtos: [], // Serviços geralmente não têm produtos
    };

    return servicoRequest;
  }

  /**
   * Mapear dados do backend para o formato usado no frontend
   */
  mapearParaFrontend(dadosBackend) {
    // Calcular progresso baseado na etapa
    const progressoInfo = this.calcularProgresso(
      dadosBackend.servico?.etapa?.nome,
    );

    return {
      id: dadosBackend.id,
      clienteId: dadosBackend.cliente?.id,
      clienteNome: dadosBackend.cliente?.nome || "Cliente não informado",
      data: dadosBackend.dataCompra,
      descricao:
        dadosBackend.servico?.descricao || dadosBackend.observacoes || "",
      status: dadosBackend.status?.nome || "Ativo",
      etapa: dadosBackend.servico?.etapa?.nome || "Aguardando orçamento",
      progresso: [progressoInfo.atual, progressoInfo.total],
      valorTotal: dadosBackend.valorTotal || 0,
      observacoes: dadosBackend.observacoes || "",
      servico: {
        nome: dadosBackend.servico?.nome || "Serviço",
        descricao: dadosBackend.servico?.descricao || "",
        precoBase: dadosBackend.servico?.precoBase || 0,
        ativo: dadosBackend.servico?.ativo !== false,
        etapa: dadosBackend.servico?.etapa,
      },
    };
  }

  /**
   * Calcular progresso baseado na etapa do serviço
   */
  calcularProgresso(nomeEtapa) {
    const etapas = {
      "Aguardando orçamento": { atual: 1, total: 6 },
      "Orçamento aprovado": { atual: 2, total: 6 },
      "Aguardando peças": { atual: 2, total: 6 },
      "Execução em andamento": { atual: 4, total: 6 },
      "Aguardando aprovação": { atual: 5, total: 6 },
      Concluído: { atual: 6, total: 6 },
      Finalizado: { atual: 6, total: 6 },
    };

    return etapas[nomeEtapa] || { atual: 1, total: 6 };
  }

  /**
   * Filtrar serviços por múltiplos critérios
   */
  filtrarServicos(servicos, filtros = {}) {
    let servicosFiltrados = [...servicos];

    // Filtro por status
    if (
      filtros.status &&
      filtros.status !== "Todos" &&
      filtros.status.length > 0
    ) {
      const statusArray = Array.isArray(filtros.status)
        ? filtros.status
        : [filtros.status];
      if (!statusArray.includes("Todos")) {
        servicosFiltrados = servicosFiltrados.filter((servico) =>
          statusArray.includes(servico.status),
        );
      }
    }

    // Filtro por etapa
    if (
      filtros.etapa &&
      filtros.etapa !== "Todos" &&
      filtros.etapa.length > 0
    ) {
      const etapaArray = Array.isArray(filtros.etapa)
        ? filtros.etapa
        : [filtros.etapa];
      if (!etapaArray.includes("Todos")) {
        servicosFiltrados = servicosFiltrados.filter((servico) =>
          etapaArray.includes(servico.etapa),
        );
      }
    }

    // Filtro por busca textual
    if (filtros.busca && filtros.busca.trim()) {
      const termoBusca = filtros.busca.toLowerCase().trim();
      servicosFiltrados = servicosFiltrados.filter((servico) =>
        [
          servico.id?.toString().padStart(3, "0"),
          servico.clienteNome,
          servico.descricao,
          servico.status,
          servico.etapa,
        ]
          .join(" ")
          .toLowerCase()
          .includes(termoBusca),
      );
    }

    return servicosFiltrados;
  }

  /**
   * Obter lista de etapas disponíveis
   */
  getEtapasDisponiveis() {
    return [
      "Aguardando orçamento",
      "Orçamento aprovado",
      "Aguardando peças",
      "Execução em andamento",
      "Aguardando aprovação",
      "Concluído",
    ];
  }

  /**
   * Obter lista de status disponíveis
   */
  getStatusDisponiveis() {
    return ["Ativo", "Finalizado", "Cancelado"];
  }
}

export default new ServicosService();
