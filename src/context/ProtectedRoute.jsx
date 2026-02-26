import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}
