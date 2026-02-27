import Api from "../client/Api";
import BaseService from "../client/BaseService";

const BASE = "/dashboard";

/**
 * Service do painel de indicadores — estende BaseService.
 * As funções exportadas abaixo mantêm compatibilidade com imports existentes.
 */
class DashboardService extends BaseService {
  constructor() {
    super(Api);
  }

  getQtdItensCriticos() {
    return this.get(`${BASE}/qtd-itens-criticos`);
  }

  getQtdAgendamentosHoje() {
    return this.get(`${BASE}/qtd-agendamentos-hoje`);
  }

  getQtdAgendamentosFuturos() {
    return this.get(`${BASE}/qtd-agendamentos-futuros`);
  }

  getEstoqueCritico() {
    return this.get(`${BASE}/estoque-critico`);
  }

  getAgendamentosFuturos() {
    return this.get(`${BASE}/agendamentos-futuros`);
  }

  async getTaxaOcupacaoServicos() {
    const result = await this.get(`${BASE}/taxa-ocupacao-servicos`);
    if (result.success && result.data?.taxaOcupacaoServicos == null) {
      return { ...result, data: { ...result.data, taxaOcupacaoServicos: 0 } };
    }
    return result;
  }

  async getQtdServicosHoje() {
    const result = await this.get(`${BASE}/qtd-servicos-hoje`);
    if (!result.success) {
      return {
        success: false,
        data: { qtdServicosHoje: 0 },
        error: result.error,
      };
    }
    if (result.data?.qtdServicosHoje == null) {
      return { ...result, data: { ...result.data, qtdServicosHoje: 0 } };
    }
    return result;
  }
}

const dashboardService = new DashboardService();

// ─── Exports nomeados para compatibilidade com imports existentes ────────────
// Wrappers garantem que nunca retornam data:null — fallback seguro p/ callers
export const getQtdItensCriticos = async () => {
  const r = await dashboardService.getQtdItensCriticos();
  return r.success ? r : { ...r, data: { quantidade: 0 } };
};
export const getQtdAgendamentosHoje = async () => {
  const r = await dashboardService.getQtdAgendamentosHoje();
  return r.success ? r : { ...r, data: { qtdAgendamentosHoje: 0 } };
};
export const getQtdAgendamentosFuturos = async () => {
  const r = await dashboardService.getQtdAgendamentosFuturos();
  return r.success ? r : { ...r, data: { qtdAgendamentosFuturos: 0 } };
};
export const getEstoqueCritico = async () => {
  const r = await dashboardService.getEstoqueCritico();
  return r.success ? r : { ...r, data: [] };
};
export const getAgendamentosFuturos = async () => {
  const r = await dashboardService.getAgendamentosFuturos();
  return r.success ? r : { ...r, data: [] };
};
export const getTaxaOcupacaoServicos = () =>
  dashboardService.getTaxaOcupacaoServicos();
export const getQtdServicosHoje = () => dashboardService.getQtdServicosHoje();

export { dashboardService };
export default dashboardService;
