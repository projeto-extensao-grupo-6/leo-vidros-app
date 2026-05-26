import axios from "axios";
import Swal from "sweetalert2";
import { repairEncoding } from "../../utils/fixEncoding";
import { publishApiError } from "../../utils/errorModalBus";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;
const ETL_URL =
  import.meta.env.VITE_MICROSERVICE_ETL_URL;

const configureInterceptors = (instance) => {
  instance.interceptors.request.use((config) => {
    if (config.method === "post" || config.method === "put") {
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    // Token é enviado automaticamente via cookie com withCredentials: true
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const responseType = response.config?.responseType;
      const isBinary = responseType === "blob" || responseType === "arraybuffer";

      if (!isBinary) {
        response.data = repairEncoding(response.data);
        response.data = unwrapEnvelope(response.data);
      }

      return response;
    },
    (error) => {
      const responseType = error.config?.responseType;
      const isBinary = responseType === "blob" || responseType === "arraybuffer";
      if (!isBinary && error.response?.data) {
        error.response.data = normalizeErrorEnvelope(error.response.data);
      }

      const skipRedirect = error.config?.skipAuthRedirect;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !skipRedirect
      ) {
        const message =
          error.response?.status === 403
            ? "Acesso negado. Faça login novamente."
            : "Sessão expirada. Faça login novamente.";

        Swal.fire({
          icon: "error",
          text: message,
          timer: 2500,
          showConfirmButton: false,
        });

        // Limpar apenas dados do usuário, não tokens (removidos dos cookies pelo servidor)
        sessionStorage.clear();

        setTimeout(() => (window.location.href = "/login"), 2500);
        return Promise.reject(error);
      }

      const silent = error.config?.silent === true;
      const status = error.response?.status;
      const isAuthRedirect = status === 401 || status === 403;

      if (!silent && !isAuthRedirect) {
        publishApiError(error);
      }

      return Promise.reject(error);
    },
  );
};

function isApiEnvelope(payload) {
  return (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    typeof payload.success === "boolean"
  );
}

function unwrapEnvelope(payload) {
  if (!isApiEnvelope(payload)) return payload;
  return payload.success ? payload.data : payload;
}

function normalizeErrorEnvelope(payload) {
  if (!isApiEnvelope(payload) || payload.success || !payload.error) return payload;
  const { code, message, details } = payload.error;
  return { code, message, details, error: payload.error };
}

const Api = axios.create({ baseURL: BACKEND_URL, withCredentials: true });
const EtlApi = axios.create({ baseURL: ETL_URL, withCredentials: true });

configureInterceptors(Api);
configureInterceptors(EtlApi);

export { EtlApi };
export default Api;
