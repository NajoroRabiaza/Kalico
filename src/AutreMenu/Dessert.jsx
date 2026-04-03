import API_URL from "../api";
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../component/navbar";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Cartes from "../component/cartes";
import Foot from "../component/footer";

function Dessert({Userconnecte}) {
  const { cart, handleClick } = useContext(CartContext);
  const { showToast } = useToast();
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchDessert = () => {
    fetch(`${API_URL}/produits/categorie/dessert`)
      .then((res) => res.json())
      .then((data) =>
        setProduits(data.map((p) => ({ ...p, img: `${API_URL}/${p.img}` })))
      )
      .catch((err) => console.error("Erreur chargement Dessert :", err));
    };
    
    fetchDessert();
    const intervalId = setInterval(fetchDessert, 15000);
    return () => clearInterval(intervalId);
    }, []);

  return (
    <>
      <Navbar size={cart.length} UserConnect={Userconnecte}/>
      <section>
        <img src="/image/font.png" alt="font" className="fonts" />
        <div className="menus">Dessert</div>
        <div className="All_Card">
          {produits.map((item) => (
            <Cartes handleClick={(item) => handleClick(item, showToast)} item={item} key={item._id} />
          ))}
        </div>
      </section>
      <footer><Foot /></footer>
    </>
  );
}

export default Dessert;
