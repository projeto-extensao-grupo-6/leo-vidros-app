// Máscara para CPF: 000.000.000-00
export const cpfMask = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
};

// Máscara para telefone: (00) 00000-0000 ou (00) 0000-0000
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

// Máscara para CEP: 00000-000
export const cepMask = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");
};

// Validação para permitir apenas letras e espaços
export const onlyLetters = (value) => {
    if (!value) return "";
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
};

// Validação de CPF
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

// Remover máscara para envio à API
export const removeMask = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "");
};
