import React, { createContext, useContext, useState } from 'react';
import './cartes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Panier from '../page/Panier';
import produitContext from '../page/home';
import "./cartes.css"
import { Row, Col } from 'react-bootstrap';


{/*export const varyContext = createContext();*/ }


const Cartes = ({ item, handleClick }) => {
  const { id, nom, description, prix, img } = item;
  const [article, setarticle] = useState([]);
  const [quantity, setQuantity] = useState(1);
  

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => {
    (quantity > 1) && setQuantity(quantity - 1)
  };

  return (
    <div className='cartes_container'>
      <img src="src\image\font.png" alt="font" className="fonts" />
      <div className='menus'></div>
      <div className='cartes'>

        <img className="cartesimage" src={img} alt="Image" />
        <div className='cartes_text'>
          <p className='titles_card' >{nom}</p>
          <p className='descriptions'><b>Ingredient:</b> {description}</p>
          <p className='price'> Prix : <b style={{ color: 'green' }}>{prix}  Ar</b></p>
          <p className="stock_rest">
              <b>Dispo :    </b>{ item.quantite} 
            </p>
          <div className="quantite-controls">
            <button className='quantite-controls1 ' onClick={decrement}>-</button>
            <span>{quantity}</span>
            <button className='quantite-controls2 ' onClick={increment}>+</button>

          </div>
          {/*<varyContext.Provider value={article} className="bouttonA"> */}
          <button onClick={() => handleClick({ ...item, quantity })} className='boutton'>Ajouter au panier</button>
          {/*</varyContext.Provider>*/}
        </div>
      </div>
    </div>

  )
}

export default Cartes;
