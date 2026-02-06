/**
 * Rotas da aplicação
 */

export const ROUTES = {
  // Autenticação
  LOGIN: '/',
  ESQUECEU_SENHA: '/esqueceu-senha',
  NOVA_SENHA: '/nova-senha',
  CADASTRO: '/cadastro',

  // Dashboard
  DASHBOARD: '/pagina-inicial',
  CALENDAR_DASHBOARD: '/calendar-dashboard',

  // Clientes
  CLIENTES: '/clientes',
  CLIENTE_DETALHES: '/clientes/:id',

  // Funcionários
  FUNCIONARIOS: '/funcionarios',
  FUNCIONARIO_DETALHES: '/funcionarios/:id',

  // Estoque
  ESTOQUE: '/estoque',
  PRODUTO_DETALHES: '/estoque/produto/:id',

  // Pedidos
  PEDIDOS: '/pedidos',
  PEDIDO_DETALHES: '/pedidos/:id',

  // Serviços
  SERVICOS: '/servicos',
  SERVICO_DETALHES: '/servicos/:id',

  // Agendamentos
  AGENDAMENTOS: '/agendamentos',

  // Solicitações
  SOLICITACOES: '/solicitacoes',

  // Perfil
  PERFIL: '/perfil',

  // Geolocalização
  GEOLOCALIZACAO: '/geolocalizacao',
};

/**
 * Gera URL com parâmetros
 * @param {string} route - Rota base
 * @param {Object} params - Parâmetros da rota
 * @returns {string} URL formatada
 */
export const generateRoute = (route, params = {}) => {
  let url = route;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
};

/**
 * Rotas públicas (não requerem autenticação)
 */
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.ESQUECEU_SENHA,
  ROUTES.NOVA_SENHA,
  ROUTES.CADASTRO,
];

/**
 * Rotas protegidas (requerem autenticação)
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.CALENDAR_DASHBOARD,
  ROUTES.CLIENTES,
  ROUTES.FUNCIONARIOS,
  ROUTES.ESTOQUE,
  ROUTES.PEDIDOS,
  ROUTES.SERVICOS,
  ROUTES.AGENDAMENTOS,
  ROUTES.SOLICITACOES,
  ROUTES.PERFIL,
  ROUTES.GEOLOCALIZACAO,
];

/**
 * Labels das rotas para navegação
 */
export const ROUTE_LABELS = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CALENDAR_DASHBOARD]: 'Calendário',
  [ROUTES.CLIENTES]: 'Clientes',
  [ROUTES.FUNCIONARIOS]: 'Funcionários',
  [ROUTES.ESTOQUE]: 'Estoque',
  [ROUTES.PEDIDOS]: 'Pedidos',
  [ROUTES.SERVICOS]: 'Serviços',
  [ROUTES.AGENDAMENTOS]: 'Agendamentos',
  [ROUTES.SOLICITACOES]: 'Solicitações',
  [ROUTES.PERFIL]: 'Perfil',
  [ROUTES.GEOLOCALIZACAO]: 'Geolocalização',
};
