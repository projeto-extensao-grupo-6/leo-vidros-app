/**
 * Instância Axios centralizada da aplicação.
 *
 * Responsabilidades:
 *  - Configura a baseURL a partir das variáveis de ambiente (VITE_API_URL / VITE_BACKEND_URL).
 *  - Injeta Content-Type: application/json automaticamente em POST e PUT.
 *  - Intercepta respostas 401/403 e exibe alerta de sessão expirada/acesso negado,
 *    limpando os storages e redirecionando para a tela de login após 2,5 s.
 *
 * Para ignorar o redirecionamento automático em uma requisição específica,
 * passe `skipAuthRedirect: true` na config Axios:
 *   Api.get('/rota', { skipAuthRedirect: true })
 */
import axios from "axios";
import Swal from "sweetalert2";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:3000/api';

const Api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// ─── Interceptor de Requisição ────────────────────────────────────────────────
// Garante Content-Type correto em mutações sem sobrescrever headers já definidos.
Api.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
});

// ─── Interceptor de Resposta ──────────────────────────────────────────────────
// Trata erros de autenticação (401) e autorização (403) de forma centralizada.
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipRedirect = error.config?.skipAuthRedirect;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !skipRedirect
    ) {
      const message =
        error.response?.status === 403
          ? 'Acesso negado. Faça login novamente.'
          : 'Sessão expirada. Faça login novamente.';

      Swal.fire({
        icon: 'error',
        text: message,
        timer: 2500,
        showConfirmButton: false,
      });

      sessionStorage.clear();
      localStorage.clear();

      setTimeout(() => (window.location.href = '/Login'), 2500);
    }

    return Promise.reject(error);
  }
);

export default Api;
