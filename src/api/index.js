/**
 * Barrel de exportação da camada de API.
 * Permite imports como: import { Api, agendamentosService, BaseService } from '@/api';
 */

export { default as Api } from './client/Api';
export { default as BaseService } from './client/BaseService';
export { agendamentosService } from './services/agendamentosService';
export { default as PedidosService } from './services/pedidosService';
export { default as ServicosService } from './services/servicosService';
export { dashboardService } from './services/dashboardService';
export * from './services/dashboardService';
export * from './queryKeys';
