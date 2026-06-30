import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const level = localStorage.getItem("userLevel");

  // Si pas de token ou level different de "admin", on redirige vers login
  // "replace" evite que la page admin se retrouve dans l'historique de navigation
  if (!token || level !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Token present et level admin confirme : on affiche le contenu protege
  return children;
}

export default ProtectedAdminRoute;
