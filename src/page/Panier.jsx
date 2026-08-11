import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../component/navbar";
import "./panier.css";
import Modal from "../component/modal";
import { createPortal } from "react-dom";
import SimpleDropdown from "../component/SimpleDropdown";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";

function Panier({ Userconnecte }) {
  const { cart, setCart } = useContext(CartContext);
  const [show, setshow] = useState(false);
  const [showError, setshowError] = useState(false);
  const { showToast } = useToast();
  const [back, setBack] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState(null);

  const increase = (_id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrease = (_id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === _id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (_id) => {
    setCart((prev) => prev.filter((item) => item._id !== _id));
    setItemToDelete(null);
  };

  const ConditionalFunc = () => {
    if (cart.length !== 0) {
      if (!Userconnecte) {
        setBack(true);
      } else {
        setshow(true);
      }
    } else {
      showToast("Veuillez choisir quelque chose à manger", "warning");
      setshow(false);
      setshowError(true);
    }
  };

  useEffect(() => {
    if (back) {
      setRedirect(true);
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [back, navigate]);

  useEffect(() => {
    if (!showError) return;
    const timer = setTimeout(() => {
      setshowError(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showError]);

  const total = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);
  const isEmpty = cart.length === 0;

  return (
    <div className="panier-page">
      <Navbar size={cart.length} UserConnect={Userconnecte} />

      <main className="panier-main">
        {/* Bouton historique des commandes */}
        <div className="panier-dropdown-wrapper">
          <SimpleDropdown />
        </div>

        <div className="panier-layout">

          {/* Colonne gauche : liste des articles */}
          <div className="panier-liste">
            <h1 className="panier-titre">Mon Panier</h1>

            {isEmpty ? (
              /* Empty state : panier vide */
              <div className="panier-empty">
                <svg
                  className="panier-empty-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                <h2 className="panier-empty-titre">Votre panier est vide</h2>
                <p className="panier-empty-texte">
                  Découvrez notre menu et ajoutez de délicieux plats.
                </p>
                <button
                  className="panier-empty-btn"
                  onClick={() => navigate("/")}
                >
                  Retour au menu
                </button>
              </div>
            ) : (
              /* Liste des articles */
              <div className="panier-articles">
                {cart.map((item) => (
                  <div className="cart_box" key={item._id}>
                    <div className="cart_img">
                      <img src={item.img} className="pan_image" alt={item.nom} />
                    </div>
                    <div className="cart_info">
                      <p className="name">{item.nom}</p>
                      <div className="quantiti">
                        <button className="bouttons" onClick={() => decrease(item._id)}>-</button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="bouttons" onClick={() => increase(item._id)}>+</button>
                      </div>
                    </div>
                    <div className="cart_prix">
                      <span className="prix_pan">{item.prix * item.quantity} Ar</span>
                      <img
                        src="/image/remove.webp"
                        alt="supprimer"
                        className="remove"
                        onClick={() => setItemToDelete(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite : résumé de commande */}
          <div className="panier-resume">
            <div className="panier-resume-card">
              <h2 className="panier-resume-titre">Résumé</h2>
              <div className="panier-resume-ligne">
                <span>Sous-total</span>
                <span>{total} Ar</span>
              </div>
              <div className="panier-resume-separateur" />
              <div className="panier-resume-total">
                <span>Total</span>
                <span className="panier-resume-total-prix">{total} Ar</span>
              </div>

              {/* Bouton desactive si panier vide */}
              <button
                className={`panier-btn-commander ${isEmpty ? "panier-btn-disabled" : ""}`}
                onClick={ConditionalFunc}
                disabled={isEmpty}
              >
                Commander
              </button>

              {isEmpty && (
                <p className="panier-resume-hint">
                  Ajoutez des articles pour commander
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Message redirection login */}
        {redirect && (
          <div className="return">
            <p>Connectez vous d'abord</p>
            <br />
            <p>Redirection vers la page login...</p>
            <br />
            <p>Veuillez patienter !</p>
          </div>
        )}
      </main>

      {show &&
        createPortal(
          <Modal
            oneclose={() => setshow(false)}
            condition={ConditionalFunc}
            totalCommande={total}
            conditionShow={show}
            SetConditionShow={setshow}
          />,
          document.body
        )}
        {itemToDelete && (
          <ConfirmDeleteModal
            itemName={itemToDelete.nom}
            onConfirm={() => removeItem(itemToDelete._id)}
            onCancel={() => setItemToDelete(null)}
          />
        )}
    </div>
    
  );
  
}

export default Panier;