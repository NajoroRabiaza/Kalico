import API_URL from "../api";
import authFetch from "../utils/authFetch";
import React, { useContext, useEffect, useState } from "react";
import "./modal.css";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Modal({ oneclose, condition, totalCommande }) {
  const { cart, setCart, setOrderHistory } = useContext(CartContext);
  const [showCash, setShowCash] = useState(true);
  const { showToast } = useToast();

  const [nameCash, setNameCash] = useState("");
  const [levelCash, setLevelCash] = useState("");
  const [nameMvola, setNameMvola] = useState("");
  const [number, setNumber] = useState("");

  const [takeNameCash, setTakeNameCash] = useState("");
  const [takelevelCash, setTakelevelCash] = useState("");
  const [takenameMvola, setTakenameMvola] = useState("");
  const [takenumMvola, setTakenumMvola] = useState("");

  const [conditionnameCash, setConditionnameCash] = useState(false);
  const [conditionlevelCash, setConditionlevelCash] = useState(false);
  const [conditionnameMvola, setConditionnameMvola] = useState(false);
  const [conditionnumMvola, setConditionnumMvola] = useState(false);

  // Cache les messages d'erreur apres 8 secondes
  // Encapsule dans useEffect pour eviter de relancer le timer a chaque re-render
  useEffect(() => {
    const hasError = conditionnameCash || conditionlevelCash || conditionnameMvola || conditionnumMvola;
    if (!hasError) return;
    const timer = setTimeout(() => {
      setConditionnameCash(false);
      setConditionlevelCash(false);
      setConditionnameMvola(false);
      setConditionnumMvola(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [conditionnameCash, conditionlevelCash, conditionnameMvola, conditionnumMvola]);

  function inputName(e) { setNameCash(e.target.value); }
  function inputLevel(e) { setLevelCash(e.target.value); }
  function inputnameMvola(e) { setNameMvola(e.target.value); }
  function inputNumber(e) { setNumber(e.target.value); }

  function conditionalModal() {
    if (nameCash.trim() === "") {
      setConditionnameCash(true);
    } else if (levelCash === "") {
      setConditionlevelCash(true);
    } else if (
      !levelCash.trim().includes("L1") &&
      !levelCash.trim().includes("L2") &&
      !levelCash.trim().includes("L3")
    ) {
      setConditionlevelCash(true);
    } else {
      setTakeNameCash(nameCash);
      setTakelevelCash(levelCash);
      condition();
    }
  }

  // Envoi commande Cash : authFetch injecte le token JWT dans le header Authorization
  useEffect(() => {
    if (!takeNameCash) return;
    const commande = {
      clientNom: takeNameCash,
      niveau: takelevelCash,
      methodePaiement: "Cash",
      produits: cart,
      total: totalCommande,
      date: new Date(),
      statut: "en attente",
    };
    authFetch(`${API_URL}/commandes`, {
      method: "POST",
      body: JSON.stringify(commande),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((savedCommande) => {
        setOrderHistory((prev) => [savedCommande, ...prev]);
        setCart([]);
        showToast("Votre commande est bien reçu, veuillez patienter !", "success");
        oneclose();
      })
      .catch(() => {
        showToast("Erreur lors de l'envoi de la commande !", "error");
      });
  }, [takeNameCash]);

  // Envoi commande Mvola : authFetch injecte le token JWT dans le header Authorization
  useEffect(() => {
    if (!takenameMvola) return;
    const commande = {
      clientNom: takenameMvola,
      numero: takenumMvola,
      methodePaiement: "Mvola",
      produits: cart,
      total: totalCommande,
      date: new Date(),
      statut: "en attente",
    };
    authFetch(`${API_URL}/commandes`, {
      method: "POST",
      body: JSON.stringify(commande),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((savedCommande) => {
        setOrderHistory((prev) => [savedCommande, ...prev]);
        setCart([]);
        showToast("Votre commande est bien reçu, veuillez patienter !", "success");
        oneclose();
      })
      .catch(() => {
        showToast("Erreur lors de l'envoi de la commande !", "error");
      });
  }, [takenameMvola]);

  function conditionMvolaModal() {
    if (nameMvola.trim() === "") {
      setConditionnameMvola(true);
    } else if (number.trim() === "") {
      setConditionnumMvola(true);
    } else if (!number.trim().includes("034") && !number.trim().includes("038")) {
      setConditionnumMvola(true);
    } else if (number.trim().length !== 10) {
      setConditionnumMvola(true);
    } else {
      setTakenameMvola(nameMvola);
      setTakenumMvola(number);
      condition();
    }
  }

  return (
    <>
      <div className="Container_MOdal">
        <h2>Page de payement</h2>
        <div>
          <h1 title="Annuler" onClick={oneclose}>x</h1>
          <div className="butonPayment">
            <button
              onClick={() => setShowCash(true)}
              className={`cashPay ${showCash ? "active" : ""}`}
            >
              <img src="/image/imageMoney.webp" alt="imageCash" /> | Cash
            </button>
            <button
              onClick={() => setShowCash(false)}
              className={`MvolaPay ${!showCash ? "active" : ""}`}
            >
              <img src="/image/MvolaImage.webp" alt="imageMvola" /> | Mvola
            </button>

            {showCash ? (
              <div className="inputText">
                {conditionnameCash && <p className="errorModal" title="Entrer un nom">!</p>}
                <label>Entrer votre Nom</label>
                <br />
                <input type="text" size={30} required value={nameCash} onChange={inputName} />
                <br />
                <label>Entrer votre niveau</label>
                {conditionlevelCash && <p className="errorModal" title="Entrer votre niveau">!</p>}
                <br />
                <input type="text" size={30} value={levelCash} onChange={inputLevel} required />
                <div className="date">
                  <h6>Vous devez payer dans les :</h6>
                  <p>10 prochain minutes</p>
                </div>
                <div className="btnSubmit">
                  <button id="SubmitBtn" onClick={conditionalModal}>Valider</button>
                </div>
              </div>
            ) : (
              <div className="inputText">
                {conditionnameMvola && <p className="erreurModal" title="Entrer un nom">!</p>}
                <label>Entrer votre Nom</label>
                <br />
                <input type="text" size={30} value={nameMvola} onChange={inputnameMvola} required />
                <br />
                {conditionnumMvola && <p className="erreurModal2" title="Entrer votre numero">!</p>}
                <label>Entrer votre numero Mvola</label>
                <br />
                <input type="tel" size={30} onChange={inputNumber} value={number} required />
                <div className="btnSubmit">
                  <button id="SubmitBtn" onClick={conditionMvolaModal}>Valider</button>
                </div>
              </div>
            )}
          </div>
          <div className="verticalLineModal"></div>
          <div className="price">
            <div className="title">
              <img src="/image/kalico.webp" alt="logo" />
            </div>
            <div className="totalModal">
              <h4>Total Acheter : {totalCommande} Ariary</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
