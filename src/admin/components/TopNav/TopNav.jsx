import { useLocation } from "react-router-dom";
import profileImg from "../../assets/images/profile-02.png";
import "./top-nav.css";

const pageTitles = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/Commande": "Les Commandes",
  "/admin/Products": "Les Produits",
  "/admin/clients": "Nos Clients",
};

const TopNav = () => {
  const { pathname } = useLocation();
  const titre = pageTitles[pathname] ?? "Administration";

  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        <h2 className="top__nav-titre">{titre}</h2>
        <div className="top__nav-right">
          <div className="profile">
            <img src={profileImg} alt="Profil administrateur" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;