import { Navigate } from 'react-router-dom';

/**
 * Componente de guarda de rota autenticada.
 * Redireciona para /Login quando o usuário não está autenticado.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}
