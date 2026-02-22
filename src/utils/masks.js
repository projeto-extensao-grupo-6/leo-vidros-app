/**
 * Máscaras de entrada e validadores de CPF para uso em campos de formulário.
 *
 * Funções de máscara: aplicadas em handlers `onChange` para formatar em tempo real.
 * Funções de validação: retornam boolean e podem ser usadas fora do Zod.
 * `removeMask`: limpa qualquer máscara antes do envio à API.
 */

/**
 * Máscara para CPF: 000.000.000-00.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const cpfMask = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
};

/**
 * Máscara para telefone fixo (00) 0000-0000 ou celular (00) 00000-0000.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    
    if (value.length <= 10) {
        return value
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    }
    
    return value
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

/**
 * Máscara para CEP: 00000-000.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const cepMask = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");
};

/**
 * Remove caracteres não alfabéticos (exceto espaços) de uma string.
 * Útil para campos de nome que devem aceitar apenas letras e acentos.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const onlyLetters = (value) => {
    if (!value) return "";
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
};

/**
 * Valida um CPF usando o algoritmo de dois dígitos verificadores.
 * @param {string} cpf - CPF com ou sem máscara
 * @returns {boolean}
 */
export const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
};

/**
 * Remove todos os caracteres não numéricos de uma string.
 * Deve ser chamado antes de enviar o valor para a API.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export const removeMask = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "");
};
