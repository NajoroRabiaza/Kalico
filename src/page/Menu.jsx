import API_URL from "../api";
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../component/navbar";
import Cartes from "../component/cartes";
import Foot from "../component/footer";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Menu({ Userconnecte }) {
  const { cart, handleClick } = useContext(CartContext);
  const { showToast } = useToast();
  const [menuSpecial, setMenuSpecial] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/produits/menuSpecial`)
      .then((res) => res.json())
      .then((data) => setMenuSpecial(data))
      .catch((err) => console.error("Erreur fetch menu special:", err));
  }, []);

  return (
    <>
      <Navbar size={cart.length} UserConnect={Userconnecte} />
      <section>
        <img src="/image/font.webp" alt="font" className="fonts" />
        <div className="menus">Menu du jour</div>
        <div className="All_Card">
          {menuSpecial.map((item) => (
            <Cartes handleClick={(item) => handleClick(item, showToast)} item={item} key={item._id} />
          ))}
        </div>
      </section>
      <footer>
        <Foot />
      </footer>
    </>
  );
}

export default Menu;
