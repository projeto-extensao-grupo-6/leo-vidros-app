import axios from "axios";
import Swal from "sweetalert2";

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const Api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, 
});

Api.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipRedirect = error.config?.skipAuthRedirect;
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !skipRedirect) {
      const message = error.response?.status === 403 
        ? "Acesso negado. Faça login novamente."
        : "Sessão expirada. Faça login novamente.";
      
      Swal.fire({
        icon: "error",
        text: message,
        timer: 2500,
        showConfirmButton: false,
      });

      sessionStorage.clear();
      localStorage.clear();
      
      setTimeout(() => (window.location.href = "/login"), 2500);
    }

    return Promise.reject(error);
  }
);

export default Api;
