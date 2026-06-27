import React, { createContext, useContext, useState } from "react";
import "./cards.css";
import Panier from "../page/Panier";
import produitContext from "../page/home";

const Cards = ({ item, handleClick }) => {
  const { id, nom, description, prix, img, quantite } = item;
  const [article, setarticle] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => {
    quantity > 1 && setQuantity(quantity - 1);
  };

  return (
    <div className="cards_container">
      {/* <img src="src\image\font.png" alt="font" className="font" /> */}
      <div className="card" onMouseLeave={() => setShowStars(false)}>
        <div className="tete">
          <img className="carteimage" src={img} alt="Image" />
        </div>

        <div className="body">
          <div className="card_text">
            <p className="titre_card">{nom}</p>

            <p className="prix">
              <b>{prix} Ar</b>{" "}
            </p>
            <div className="quantity-controls">
              <button className="quantity-controls1 " onClick={decrement}>
                -
              </button>
              <span className="qtt">{quantity}</span>
              <button className="quantity-controls2 " onClick={increment}>
                +
              </button>
            </div>
            <p className="stock_restant">
              <b>Dispo :</b> {quantite}
            </p>

            <p className="description">
              <b>Ingredient: </b>
              {description}
            </p>
            <button
              onClick={() => handleClick({ ...item, quantity: quantity || 1 })}
              className="ajouter"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
