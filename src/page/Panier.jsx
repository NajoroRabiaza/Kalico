import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../component/navbar";
import "./panier.css";
import Modal from "../component/modal";
import { createPortal } from "react-dom";
import SimpleDropdown from "../component/SimpleDropdown";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router";
import { formatPrice } from "../utils/formatPrice";
import CartItemNote from "../component/CartItemNote";
import PromoCode from "../component/PromoCode";
import UndoToast from "../component/UndoToast";
import useCartWithUndo from "../hooks/useCartWithUndo";
import authFetch from "../utils/authFetch";
import API_URL from "../api";

function DeleteControl({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);

  const handleTrashClick = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => {
      setConfirming(false);
    }, 10000);
  };

  const handleConfirm = () => {
    clearTimeout(timerRef.current);
    onConfirm();
  };

  const handleClickOutside = () => {
    clearTimeout(timerRef.current);
    setConfirming(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (confirming) {
    return (
      <div className="delete-confirm-inline">
        <button className="delete-confirm-btn" onClick={handleConfirm}>
          Supprimer vraiment ?
        </button>
        <div className="delete-confirm-backdrop" onClick={handleClickOutside} />
      </div>
    );
  }

  return (
    <button className="trash-btn" onClick={handleTrashClick} aria-label="Supprimer cet article">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="trash-icon">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  );
}

function AnimatedCartItem({ children, isRemoving }) {
  return (
    <div className={`cart-item-wrapper ${isRemoving ? "cart-item-wrapper--removing" : ""}`}>
      {children}
    </div>
  );
}

function Panier({ Userconnecte }) {
  const { cart, setCart } = useContext(CartContext);
  const [show, setshow] = useState(false);
  const [showError, setshowError] = useState(false);
  const { showToast } = useToast();
  const [back, setBack] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);
  const navigate = useNavigate();

  // Etat de la promo appliquee : null si aucune, sinon { code, typeReduction, valeur }
  const [promoAppliquee, setPromoAppliquee] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const { removeItem, pendingRemoval, undoRemoval, dismissUndo } =
    useCartWithUndo(cart, setCart);

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

  const handleRemove = (_id) => {
    setRemovingIds((prev) => [...prev, _id]);
    setTimeout(() => {
      removeItem(_id);
      setRemovingIds((prev) => prev.filter((id) => id !== _id));
    }, 320);
  };

  const handleNoteChange = (_id, note) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, note } : item
      )
    );
  };

  // Appelle la route POST /promo/validate et met a jour l'etat promoAppliquee.
  // Retourne { ok, message } pour que PromoCode affiche le bon feedback.
  const handlePromoApply = async (code) => {
    setPromoLoading(true);
    try {
      const res = await authFetch(`${API_URL}/promo/validate`, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPromoAppliquee(null);
        return { ok: false, message: data.message || "Code invalide." };
      }

      setPromoAppliquee({
        code,
        typeReduction: data.typeReduction,
        valeur: data.valeur,
      });
      return { ok: true, message: data.message };
    } catch {
      setPromoAppliquee(null);
      return { ok: false, message: "Erreur réseau. Réessayez." };
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePromoReset = () => {
    setPromoAppliquee(null);
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

  const sousTotal = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  // Calcul de la reduction selon le type retourne par le backend
  const calculerReduction = () => {
    if (!promoAppliquee) return 0;
    if (promoAppliquee.typeReduction === "pourcentage") {
      return Math.round(sousTotal * (promoAppliquee.valeur / 100));
    }
    // type "fixe" : reduction plafonnee au sous-total pour eviter un total negatif
    return Math.min(promoAppliquee.valeur, sousTotal);
  };

  const reduction = calculerReduction();
  const total = sousTotal - reduction;
  const isEmpty = cart.length === 0;

  return (
    <div className="panier-page">
      <Navbar size={cart.length} UserConnect={Userconnecte} />

      <main className="panier-main">
        <div className="panier-dropdown-wrapper">
          <SimpleDropdown />
        </div>

        <div className="panier-layout">
          <div className="panier-liste">
            <h1 className="panier-titre">Mon Panier</h1>

            {isEmpty && !pendingRemoval ? (
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
              <div className="panier-articles">
                {cart.map((item) => (
                  <AnimatedCartItem
                    key={item._id}
                    isRemoving={removingIds.includes(item._id)}
                  >
                    <div className="cart_box">
                      <div className="cart_img">
                        <img src={item.img} className="pan_image" alt={item.nom} />
                      </div>
                      <div className="cart_info">
                        <p className="name">{item.nom}</p>
                        <p className="unit-price">{formatPrice(item.prix)} / unité</p>
                        <div className="quantiti">
                          <button className="bouttons" onClick={() => decrease(item._id)}>-</button>
                          <span className="quantity">{item.quantity}</span>
                          <button className="bouttons" onClick={() => increase(item._id)}>+</button>
                        </div>
                        <CartItemNote
                          itemId={item._id}
                          onNoteChange={handleNoteChange}
                        />
                      </div>
                      <div className="cart_prix">
                        <span className="prix_pan">{formatPrice(item.prix * item.quantity)}</span>
                        <DeleteControl onConfirm={() => handleRemove(item._id)} />
                      </div>
                    </div>
                  </AnimatedCartItem>
                ))}
              </div>
            )}
          </div>

          <div className="panier-resume">
            <div className="panier-resume-card">
              <h2 className="panier-resume-titre">Résumé</h2>
              <div className="panier-resume-ligne">
                <span>Sous-total</span>
                <span>{formatPrice(sousTotal)}</span>
              </div>

              {promoAppliquee && (
                <div className="panier-resume-ligne panier-resume-promo">
                  <span>
                    Code{" "}
                    <strong className="panier-promo-code">{promoAppliquee.code}</strong>
                  </span>
                  <span className="panier-promo-reduction">
                    -{formatPrice(reduction)}
                  </span>
                </div>
              )}

              <div className="panier-resume-ligne panier-resume-livraison">
                <span>Livraison</span>
                <span className="panier-resume-livraison-valeur">
                  Calculée à l'étape suivante
                </span>
              </div>
              <div className="panier-resume-separateur" />
              <div className="panier-resume-total">
                <span>Total</span>
                <span className="panier-resume-total-prix">{formatPrice(total)}</span>
              </div>

              <PromoCode
                onApply={handlePromoApply}
                onReset={handlePromoReset}
                loading={promoLoading}
                appliquee={promoAppliquee}
              />

              <button
                className={`panier-btn-commander ${isEmpty ? "panier-btn-disabled" : ""}`}
                onClick={ConditionalFunc}
                disabled={isEmpty}
              >
                <span>Commander</span>
                {!isEmpty && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="commander-arrow"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
              <div className="panier-reassurance">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="panier-reassurance-icon"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Paiement 100&nbsp;% sécurisé</span>
              </div>
              {isEmpty && !pendingRemoval && (
                <p className="panier-resume-hint">
                  Ajoutez des articles pour commander
                </p>
              )}
            </div>
          </div>
        </div>

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

      {!isEmpty && (
        <div className="mobile-bar">
          <div className="mobile-bar-total">
            <p className="mobile-bar-label">Total</p>
            <p className="mobile-bar-prix">{formatPrice(total)}</p>
          </div>
          <button
            className="mobile-bar-btn"
            onClick={ConditionalFunc}
          >
            <span>Commander</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mobile-bar-arrow"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}

      {pendingRemoval && (
        <UndoToast
          item={pendingRemoval}
          onUndo={undoRemoval}
          onDismiss={dismissUndo}
        />
      )}

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
    </div>
  );
}

export default Panier;