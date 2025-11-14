import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  // Если пользователь не авторизован → отправляем на /auth
  if (!user) return <Navigate to="/auth" replace />;

  // Если это защищённый маршрут для админа и user не admin
  if (admin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}
