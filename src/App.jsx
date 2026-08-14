import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProtectedAdminRoute from "./component/ProtectedAdminRoute";

const Home = lazy(() => import("./page/home"));
const Inscription = lazy(() => import("./page/Singin"));
const Panier = lazy(() => import("./page/Panier"));
const Loginpage = lazy(() => import("./page/login"));
const ForgotPassword = lazy(() => import("./page/forgotPass"));
const ChangePassword = lazy(() => import("./page/forgotPassword2"));
const Menu = lazy(() => import("./page/Menu"));
const Soupe = lazy(() => import("./AutreMenu/Soupe"));
const MenuBurger = lazy(() => import("./AutreMenu/Burger"));
const Dessert = lazy(() => import("./AutreMenu/Dessert"));
const Riz = lazy(() => import("./AutreMenu/Riz"));
const Jus = lazy(() => import("./AutreMenu/Jus"));
const AppAdmin = lazy(() => import("./admin/AppAdmin"));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [connecte, setConnecte] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  // Ecoute l'evenement emis par authFetch quand le backend retourne 401 ou 403
  // Declenche une deconnexion propre sans recharger la page
  useEffect(() => {
    const handleExpire = () => {
      setConnecte(false);
      navigate("/login");
    };

    window.addEventListener("auth:expire", handleExpire);
    return () => window.removeEventListener("auth:expire", handleExpire);
  }, [navigate]);

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/SignUp" ||
      location.pathname === "/forgotPassword" ||
      location.pathname.startsWith("/ChangePassword")
    ) {
      document.body.style.backgroundImage = `url("/image/backgroundLogin.webp")`;
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [location]);

  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "4rem" }}>Chargement...</div>}>
      <Routes>
        <Route path="/" element={<Home Userconnecte={connecte} />} />
        <Route path="/SignUp" element={<Inscription />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/ChangePassword/:id" element={<ChangePassword />} />
        <Route path="/login" element={<Loginpage setUserConnecte={setConnecte} />} />
        <Route path="/panier" element={<Panier Userconnecte={connecte} />} />
        <Route path="/Riz" element={<Riz Userconnecte={connecte} />} />
        <Route path="/Burger" element={<MenuBurger Userconnecte={connecte} />} />
        <Route path="/Dessert" element={<Dessert Userconnecte={connecte} />} />
        <Route path="/Jus" element={<Jus Userconnecte={connecte} />} />
        <Route path="/Menu" element={<Menu Userconnecte={connecte} />} />
        <Route path="/Soupe" element={<Soupe Userconnecte={connecte} />} />

        {/* Route protegee : seul un utilisateur avec level "admin" y a acces */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AppAdmin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;