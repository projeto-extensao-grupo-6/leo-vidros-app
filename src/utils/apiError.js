const STATUS_TITLES = {
  400: "Requisição inválida",
  401: "Sessão expirada",
  403: "Acesso negado",
  404: "Não encontrado",
  409: "Conflito",
  422: "Dados inválidos",
  429: "Muitas tentativas",
  500: "Erro interno",
  503: "Serviço indisponível",
};

const CODE_TITLES = {
  VALIDATION_ERROR: "Dados inválidos",
  REGRA_NEGOCIO: "Operação não permitida",
  NOT_FOUND: "Não encontrado",
  UNAUTHORIZED: "Sessão expirada",
  FORBIDDEN: "Acesso negado",
  CONFLICT: "Conflito",
  DATA_INTEGRITY_VIOLATION: "Conflito de dados",
  INTERNAL_SERVER_ERROR: "Erro interno",
};

const NOISE_DETAIL_KEYS = new Set(["timestamp", "status", "path", "exception"]);

export function extractApiError(input) {
  if (!input) {
    return { code: "UNKNOWN", message: "Ocorreu um erro inesperado.", details: null, status: null };
  }

  const status = input.response?.status ?? input.status ?? null;
  const payload = input.response?.data ?? input.data ?? input;

  let code = payload?.code ?? payload?.error?.code ?? null;
  let message = payload?.message ?? payload?.error?.message ?? null;
  let details = payload?.details ?? payload?.error?.details ?? null;

  if (!message) {
    if (input.message && !/request failed|network error/i.test(input.message)) {
      message = input.message;
    } else if (/network error/i.test(input.message ?? "")) {
      message = "Sem conexão com o servidor. Verifique sua internet.";
      code = code ?? "NETWORK_ERROR";
    } else if (/timeout/i.test(input.message ?? "")) {
      message = "O servidor demorou para responder. Tente novamente.";
      code = code ?? "TIMEOUT";
    } else {
      message = "Ocorreu um erro inesperado.";
    }
  }

  if (!code && status) code = `HTTP_${status}`;

  return { code, message, details: cleanDetails(details), status };
}

export function titleForError({ code, status }) {
  if (code && CODE_TITLES[code]) return CODE_TITLES[code];
  if (status && STATUS_TITLES[status]) return STATUS_TITLES[status];
  return "Erro";
}

export function fieldErrorsFromDetails(details) {
  if (!details || typeof details !== "object") return null;
  const campos = details.campos;
  if (!campos || typeof campos !== "object") return null;
  return Object.entries(campos).map(([campo, mensagem]) => ({ campo, mensagem }));
}

function cleanDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) return details ?? null;
  const entries = Object.entries(details).filter(([key]) => !NOISE_DETAIL_KEYS.has(key));
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}
