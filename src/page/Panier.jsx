import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../component/navbar";
import "./panier.css";
import Modal from "../component/modal";
import { createPortal } from "react-dom";
import SimpleDropdown from "../component/SimpleDropdown";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router";

function Panier({ Userconnecte }) {
  const { cart, setCart } = useContext(CartContext);
  const [show, setshow] = useState(false);
  const [showError, setshowError] = useState(false);
  const { showToast } = useToast();
  const [back, setBack] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();

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
  };

  const ConditionalFunc = () => {
    if (cart.length !== 0) {
      if (!Userconnecte) {
        setBack(true);
      } else {
        setshow(true);
      }
    } else {
      showToast("Vous n'avez pas faim? veuiller choisir quelque chose à manger", "warning");
      setshow(false);
      setshowError(true);
    }
  };

  // Redirection vers login si utilisateur non connecte
  // navigate est inclus dans les dependances car il est utilise dans l'effet
  useEffect(() => {
    if (back) {
      setRedirect(true);
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      // Cleanup : annule le timer si le composant est demonte avant les 5s
      return () => clearTimeout(timer);
    }
  }, [back, navigate]);

  // Cache le message d'erreur panier vide apres 8 secondes
  // Encapsule dans useEffect pour eviter de relancer le timer a chaque re-render
  useEffect(() => {
    if (!showError) return;
    const timer = setTimeout(() => {
      setshowError(false);
    }, 8000);
    // Cleanup : annule le timer si showError redevient false avant les 8s
    return () => clearTimeout(timer);
  }, [showError]);

  const total = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  return (
    <>
      <Navbar size={cart.length} UserConnect={Userconnecte} />
      <div className="panier_container_main">
        <div className="panier_container">
          <div style={{ position: "absolute", bottom: "55%" }}>
            <SimpleDropdown />
          </div>
          <div className="ScrollPanier">
            <article>
              {cart.map((item) => (
                <div className="cart_box" key={item._id}>
                  <div className="cart_img">
                    <img src={item.img} className="pan_image" alt="Produit" />
                    <p className="name">{item.nom}</p>
                  </div>
                  <div className="quantiti">
                    <button
                      className="bouttons"
                      onClick={() => decrease(item._id)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="bouttons"
                      onClick={() => increase(item._id)}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    <span className="prix_pan">
                      {item.prix * item.quantity} Ar
                    </span>
                    <img
                      src="/image/remove.webp"
                      alt="supp"
                      className="remove"
                      onClick={() => removeItem(item._id)}
                    />
                  </div>
                </div>
              ))}
            </article>
          </div>

          <div>
            <h1 className="total">Total de la commande : {total} Ariary</h1>
            <button
              style={{
                color: "white",
                borderRadius: "20px",
                width: "200px",
                height: "55px",
                position: "absolute",
                top: "168.5%",
                right: "200px",
                fontSize: "30px",
              }}
              id="btnconfirme"
              onClick={ConditionalFunc}
            >
              Commander
            </button>
          </div>

          {show ? (
            createPortal(
              <Modal
                oneclose={() => setshow(false)}
                condition={ConditionalFunc}
                totalCommande={total}
                conditionShow={show}
                SetConditionShow={setshow}
              />,
              document.body
            )
          ) : redirect ? (
            <div className="return">
              <p>Connectez vous d'abord</p>
              <br />
              <p>Redirection vers la page login</p>
              <br />
              <p>Veuillez patienter!</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Panier;