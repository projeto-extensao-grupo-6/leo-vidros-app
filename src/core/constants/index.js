/**
 * Exportações centralizadas de constantes
 */

export * from './statuses';
export * from './options';
export * from './routes';

// Constantes gerais
export const APP_NAME = 'Léo Vidros';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000; // 30 segundos

// Paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Limites
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const MAX_UPLOAD_FILES = 5;

// Formatos de data
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Validação
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 50;
export const CPF_LENGTH = 11;
export const CNPJ_LENGTH = 14;
export const CEP_LENGTH = 8;
export const PHONE_MIN_LENGTH = 10;
export const PHONE_MAX_LENGTH = 11;

// LocalStorage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

// Cores do tema (sincronizado com Tailwind)
export const THEME_COLORS = {
  PRIMARY: '#007EA7',
  SECONDARY: '#003D6B',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
};
