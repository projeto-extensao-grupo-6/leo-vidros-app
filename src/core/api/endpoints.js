/**
 * Endpoints da API
 * Centraliza todos os endpoints em um único lugar
 */
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Usuários
  USERS: '/usuarios',
  
  // Clientes
  CLIENTS: '/clientes',
  
  // Funcionários
  EMPLOYEES: '/funcionarios',
  
  // Produtos
  PRODUCTS: '/produtos',
  
  // Estoque
  STOCK: '/estoque',
  
  // Pedidos
  ORDERS: '/pedidos',
  
  // Serviços
  SERVICES: '/servicos',
  
  // Agendamentos
  APPOINTMENTS: '/agendamentos',
  
  // Solicitações
  REQUESTS: '/solicitacoes',
  
  // Dashboard
  DASHBOARD: '/dashboard',
};

export default API_ENDPOINTS;
