export const formatCurrency = (value) => {
  if (value == null || isNaN(Number(value))) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

// Formata quantidades e demais números que NÃO são preço.
// Coage strings (ex.: "4.00" vindo da API) e remove zeros decimais à direita:
// 4.00 -> "4", 2.50 -> "2,5", 1234.5 -> "1.234,5".
export const formatQuantidade = (value) => {
  const n = typeof value === "number" ? value : parseFloat(value);
  if (value == null || isNaN(n)) return "0";
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
};

// Limpa números com excesso de casas decimais embutidos em textos legados
// (ex.: observações antigas com "3,000000 unidades" -> "3 unidades").
// Só atinge números com 3+ casas decimais; valores monetários "85,00" ficam intactos.
export const limparNumerosObservacao = (texto) => {
  if (!texto) return texto;
  return String(texto).replace(/\d+[.,]\d{3,}/g, (m) =>
    formatQuantidade(m.replace(",", ".")),
  );
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  return Number(
    String(value)
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
};

export const formatPhone = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 8) {
    return digits.replace(/(\d{4})(\d{4})/, "$1-$2");
  }

  if (digits.length === 9 && digits.startsWith("9")) {
    return digits.replace(/(\d{5})(\d{4})/, "$1-$2");
  }

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export const formatDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const toInputDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

export const formatCpf = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const formatCep = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};
