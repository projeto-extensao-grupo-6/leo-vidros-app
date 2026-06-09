import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
