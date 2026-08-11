import React, { useState } from 'react';
import './cartes.css';

const Cartes = ({ item, handleClick }) => {
  const { nom, description, prix } = item;
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="cartes_container">
      <div className="cartes">

        <div className="cartes-image-wrapper">
          <img className="cartesimage" src={item.img} alt={nom} />
          <span className="cartes-prix-badge">{prix} Ar</span>
        </div>

        <div className="cartes-body">
          <p className="cartes-titre">{nom}</p>
          <p className="cartes-description">{description}</p>

          <div className="cartes-footer">
            <div className="cartes-quantity-controls">
              <button className="cartes-qty-btn" onClick={decrement}>-</button>
              <span className="cartes-qty-value">{quantity}</span>
              <button className="cartes-qty-btn" onClick={increment}>+</button>
            </div>
            <button
              onClick={() => handleClick({ ...item, quantity })}
              className="cartes-ajouter"
            >
              Ajouter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cartes;