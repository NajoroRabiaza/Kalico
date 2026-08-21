import React, { useState } from "react";
import "./cards.css";
import "./cartes.css";

const styles = {
  card: {
    container: "cards_container",
    wrapper: "card",
    imageWrapper: "card-image-wrapper",
    image: "carteimage",
    prixBadge: "prix-badge",
    body: "card-body",
    titre: "titre_card",
    description: "description",
    footer: "card-footer",
    quantityControls: "quantity-controls",
    btnDecrement: "quantity-controls1",
    qty: "qtt",
    btnIncrement: "quantity-controls2",
    btnAjouter: "ajouter",
  },
  cartes: {
    container: "cartes_container",
    wrapper: "cartes",
    imageWrapper: "cartes-image-wrapper",
    image: "cartesimage",
    prixBadge: "cartes-prix-badge",
    body: "cartes-body",
    titre: "cartes-titre",
    description: "cartes-description",
    footer: "cartes-footer",
    quantityControls: "cartes-quantity-controls",
    btnDecrement: "cartes-qty-btn",
    qty: "cartes-qty-value",
    btnIncrement: "cartes-qty-btn",
    btnAjouter: "cartes-ajouter",
  },
};

const ProductCard = ({ item, handleClick, variant = "card" }) => {
  const { nom, description, prix } = item;
  const [quantity, setQuantity] = useState(1);
  const s = styles[variant] ?? styles.card;

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className={s.container}>
      <div className={s.wrapper}>

        <div className={s.imageWrapper}>
          <img className={s.image} src={item.img} alt={nom} loading="lazy" />
          <span className={s.prixBadge}>{prix} Ar</span>
        </div>

        <div className={s.body}>
          <p className={s.titre}>{nom}</p>
          <p className={s.description}>{description}</p>

          <div className={s.footer}>
            <div className={s.quantityControls}>
              <button className={s.btnDecrement} onClick={decrement}>-</button>
              <span className={s.qty}>{quantity}</span>
              <button className={s.btnIncrement} onClick={increment}>+</button>
            </div>
            <button
              onClick={() => {
                handleClick({ ...item, quantity });
                setQuantity(1);
              }}
              className={s.btnAjouter}
            >
              Ajouter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
