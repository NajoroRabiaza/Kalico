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

        {/* Zone image avec hauteur fixe et overflow hidden
            Le badge prix est positionne en absolu sur l'image
            pour ne pas chevaucher le titre en dessous */}
        <div className="card-image-wrapper">
          <img className="carteimage" src={item.img} alt={nom} />
          <span className="prix-badge">{prix} Ar</span>
        </div>

        {/* Zone contenu en flex-col pour empiler proprement */}
        <div className="card-body">
          <p className="titre_card">{nom}</p>
          <p className="description">{description}</p>

          <div className="card-footer">
            <div className="quantity-controls">
              <button className="quantity-controls1" onClick={decrement}>-</button>
              <span className="qtt">{quantity}</span>
              <button className="quantity-controls2" onClick={increment}>+</button>
            </div>
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