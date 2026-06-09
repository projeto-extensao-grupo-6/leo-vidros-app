import Api from "../client/Api";
import BaseService from "../client/BaseService";

const BASE = "/dashboard";

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

  getEstoqueCritico() {
    return this.get(`${BASE}/estoque-critico`);
  }

  getAgendamentosFuturos() {
    return this.get(`${BASE}/agendamentos-futuros`);
  }

}

const dashboardService = new DashboardService();

export const getQtdItensCriticos = async () => {
  const r = await dashboardService.getQtdItensCriticos();
  return r.success ? r : { ...r, data: { quantidade: 0 } };
};
export const getQtdAgendamentosHoje = async () => {
  const r = await dashboardService.getQtdAgendamentosHoje();
  return r.success ? r : { ...r, data: { qtdAgendamentosHoje: 0 } };
};
export const getEstoqueCritico = async () => {
  const r = await dashboardService.getEstoqueCritico();
  return r.success ? r : { ...r, data: [] };
};
export const getAgendamentosFuturos = async () => {
  const r = await dashboardService.getAgendamentosFuturos();
  return r.success ? r : { ...r, data: [] };
};
export const getFaturamentoMes = async () => {
  const r = await dashboardService.get(`${BASE}/faturamento-mes`);
  return r.success ? r : { ...r, data: { faturamentoMes: 0, percentualVariacao: null } };
};
export const getOrcamentosAbertos = async () => {
  const r = await dashboardService.get(`${BASE}/orcamentos-abertos`);
  return r.success ? r : { ...r, data: { quantidade: 0, valorTotal: 0 } };
};

export const getFaturamentoAnual = async () => {
  const r = await dashboardService.get(`${BASE}/faturamento-anual`);
  return r.success ? r : { ...r, data: { ano: new Date().getFullYear(), meses: [] } };
};

export { dashboardService };
export default dashboardService;
