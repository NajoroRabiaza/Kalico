import React, { useState } from "react";
import "./cards.css";

const Cards = ({ item, handleClick }) => {
  const { nom, description, prix, quantite } = item;
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="cards_container">
      <div className="card">
        <div className="tete">
          <img className="carteimage" src={item.img} alt={nom} />
        </div>
        <div className="body">
          <div className="card_text">
            <p className="titre_card">{nom}</p>
            <p className="prix">
              <b>{prix} Ar</b>
            </p>
            <div className="quantity-controls">
              <button className="quantity-controls1" onClick={decrement}>-</button>
              <span className="qtt">{quantity}</span>
              <button className="quantity-controls2" onClick={increment}>+</button>
            </div>
            <p className="stock_restant">
              <b>Dispo :</b> {quantite}
            </p>
            <p className="description">
              <b>Ingredient: </b>{description}
            </p>
            <button
              onClick={() => handleClick({ ...item, quantity })}
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