/**
 * Formatadores centralizados de moeda, telefone, data e outros.
 * Use estas funções em vez de implementações inline nos componentes.
 */

// ──────────────────────────────────────────────────────────────────────────────
// MOEDA
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Formata um número como moeda brasileira: R$ 1.234,56
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value == null || isNaN(Number(value))) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
};

/**
 * Converte uma string de moeda formatada de volta para número.
 * Ex: "R$ 1.234,56" → 1234.56
 * @param {string} value
 * @returns {number}
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  return Number(
    String(value)
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// TELEFONE
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Formata um número de telefone brasileiro.
 * Suporta fixo (10 dígitos) e celular (11 dígitos).
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const formatPhone = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// ──────────────────────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Formata uma data ISO ou Date para o padrão brasileiro dd/MM/yyyy.
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export const formatDate = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Formata uma data ISO para dd/MM/yyyy HH:mm.
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export const formatDateTime = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Retorna uma string de data no formato yyyy-MM-dd (uso em inputs type="date").
 * @param {Date} date
 * @returns {string}
 */
export const toInputDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// ──────────────────────────────────────────────────────────────────────────────
// CPF / CEP
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Formata CPF: 000.000.000-00
 * @param {string} value
 * @returns {string}
 */
export const formatCpf = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

/**
 * Formata CEP: 00000-000
 * @param {string} value
 * @returns {string}
 */
export const formatCep = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};
