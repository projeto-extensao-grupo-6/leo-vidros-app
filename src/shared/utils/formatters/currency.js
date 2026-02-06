/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "R$ 0,00";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(numValue);
};

/**
 * Remove formatação de moeda e converte para número
 * @param {string} value - Valor formatado como moeda
 * @returns {number} Valor numérico
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  const cleaned = String(value)
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleaned) || 0;
};

/**
 * Formata um valor com separador de milhares
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado (ex: "1.234")
 */
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return "0";
  
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata percentual
 * @param {number} value - Valor decimal (ex: 0.15 para 15%)
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Valor formatado (ex: "15%")
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value == null || isNaN(value)) return "0%";
  
  return `${(value * 100).toFixed(decimals)}%`;
};
