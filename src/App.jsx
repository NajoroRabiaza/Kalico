import { Route, Routes } from "react-router-dom";
import Inscription from "./page/Singin";
import Home from "./page/home";
import Panier from "./page/Panier";
import Soupe from './AutreMenu/Soupe.jsx';
import MenuBurger from './AutreMenu/Burger.jsx';
import Dessert from './AutreMenu/Dessert.jsx';
import Riz from './AutreMenu/Riz.jsx';
import Jus from './AutreMenu/Jus.jsx';
import Menu from './page/Menu.jsx';
import Loginpage from "./page/login.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppAdmin from "./admin/AppAdmin.jsx";
import ForgotPassword from "./page/forgotPass.jsx";
import ChangePassword from "./page/forgotPassword2.jsx";
import { useState } from "react";


function App() {

  const location = useLocation();
  //   On lit le localStorage au démarrage pour restaurer la session
  const [connecte, setConnecte] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/SignUp" ||
      location.pathname === "/forgotPassword" ||
      location.pathname.startsWith("/ChangePassword")
    ) {
      // Syntaxe CSS correcte pour backgroundImage
      document.body.style.backgroundImage = `url("/image/backgroundLogin.png")`;
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [location]); 
  return (
    <Routes>
       <Route path="/" element={< Home Userconnecte={connecte}   />} /> 
      <Route path="/SignUp" element={<Inscription />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/ChangePassword/:id" element={<ChangePassword />} />
      <Route path="/login" element={<Loginpage setUserConnecte={setConnecte} />} />
      <Route path="/panier" element={<Panier  Userconnecte={connecte} />} />
      <Route path="/Riz" element={<Riz  Userconnecte={connecte} />} />
      <Route path="/Burger" element={<MenuBurger  Userconnecte={connecte} />} />
      <Route path="/Dessert" element={<Dessert  Userconnecte={connecte}/>} />
      <Route path="/Jus" element={<Jus  Userconnecte={connecte} />} />
      <Route path="/Menu" element={<Menu Userconnecte={connecte}/>}   />
      <Route path="/Soupe" element={<Soupe Userconnecte={connecte}/>} />
      <Route path="/admin/*" element={<AppAdmin />} />


    </Routes>

  )


}

export default App;
