/**
 * Formata um número de telefone brasileiro
 * @param {string} phoneStr - Número de telefone
 * @returns {string} Telefone formatado (ex: "(11) 98765-4321")
 */
export const formatPhone = (phoneStr) => {
  if (!phoneStr) return "N/A";
  
  const cleaned = phoneStr.replace(/\D/g, "");
  
  // Celular: (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  }
  
  // Fixo: (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Retorna o valor original se não corresponder aos formatos esperados
  return phoneStr;
};

/**
 * Remove formatação de telefone
 * @param {string} phone - Telefone formatado
 * @returns {string} Apenas números
 */
export const unformatPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

/**
 * Valida se é um número de telefone válido
 * @param {string} phone - Telefone a validar
 * @returns {boolean} True se válido
 */
export const isValidPhone = (phone) => {
  const cleaned = unformatPhone(phone);
  return cleaned.length === 10 || cleaned.length === 11;
};
