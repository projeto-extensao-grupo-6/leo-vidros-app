export const normalizeStatus = (s) =>
  (s || "PENDENTE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

export const statusConfig = {
  PENDENTE: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  "EM ANDAMENTO": {
    label: "Em Andamento",
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
};

export const getStatusConfig = (status) =>
  statusConfig[normalizeStatus(status)] || statusConfig.PENDENTE;

export const tipoConfig = {
  SERVICO: {
    label: "Serviço",
    color: "bg-blue-100 text-blue-700",
    dotColor: "#3B82F6",
  },
  ORCAMENTO: {
    label: "Orçamento",
    color: "bg-amber-100 text-amber-700",
    dotColor: "#FBBF24",
  },
};

export const getTipoConfig = (tipo) => tipoConfig[tipo] || tipoConfig.SERVICO;

export const statusColors = {
  PENDENTE: {
    bg: "bg-yellow-100",
    border: "border-l-yellow-500",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  CONFIRMADO: {
    bg: "bg-green-100",
    border: "border-l-green-500",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  CONCLUIDO: {
    bg: "bg-blue-100",
    border: "border-l-blue-500",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  CANCELADO: {
    bg: "bg-red-100",
    border: "border-l-red-500",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  "EM ANDAMENTO": {
    bg: "bg-purple-100",
    border: "border-l-purple-500",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
};

export const tipoColors = {
  SERVICO: "#3B82F6",
  ORCAMENTO: "#FBBF24",
};

export const STATUS_COLORS_MAP = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  EM_EXECUCAO: "bg-indigo-100 text-indigo-800",
  "EM ANDAMENTO": "bg-indigo-100 text-indigo-800",
  CONCLUIDO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export const getStatusColor = (status) =>
  STATUS_COLORS_MAP[normalizeStatus(status)] || "bg-gray-100 text-gray-800";

export const TIPO_COLORS = {
  SERVICO: "bg-purple-100 text-purple-800",
  ORCAMENTO: "bg-orange-100 text-orange-800",
};
