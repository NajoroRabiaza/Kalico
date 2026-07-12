import React, { useState } from 'react';
import './cartes.css';

const Cartes = ({ item, handleClick }) => {
  const { nom, description, prix, img } = item;
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className='cartes_container'>
      <div className='cartes'>
        <img className="cartesimage" src={img} alt={nom} />
        <div className='cartes_text'>
          <p className='titles_card'>{nom}</p>
          <p className='descriptions'><b>Ingredient:</b> {description}</p>
          <p className='price'>Prix : <b style={{ color: 'green' }}>{prix} Ar</b></p>
          <p className="stock_rest">
            <b>Dispo :</b> {item.quantite}
          </p>
          <div className="quantite-controls">
            <button className='quantite-controls1' onClick={decrement}>-</button>
            <span>{quantity}</span>
            <button className='quantite-controls2' onClick={increment}>+</button>
          </div>
          <button
            onClick={() => handleClick({ ...item, quantity })}
            className='boutton'
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cartes;