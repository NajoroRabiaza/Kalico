import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const level = localStorage.getItem("userLevel");

  if (!token || level !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // On verifie que le token n'est pas expire
  // jwt.verify ne peut pas etre fait cote frontend sans la cle secrete
  // jwtDecode lit juste le payload sans verifier la signature
  // mais suffit pour controler la date d'expiration cote client
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // en secondes comme exp dans le JWT

    if (decoded.exp < now) {
      // Token expire : on nettoie le localStorage et on redirige
      localStorage.removeItem("token");
      localStorage.removeItem("userLevel");
      localStorage.removeItem("userName");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // Token malforme ou illisible : on redirige vers login
    localStorage.removeItem("token");
    localStorage.removeItem("userLevel");
    localStorage.removeItem("userName");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
