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

  const [loading, setLoading] = useState(false);

  const [conditionnameCash, setConditionnameCash] = useState(false);
  const [conditionlevelCash, setConditionlevelCash] = useState(false);
  const [conditionnameMvola, setConditionnameMvola] = useState(false);
  const [conditionnumMvola, setConditionnumMvola] = useState(false);

  // Cache les messages d'erreur apres 8 secondes
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

  // Envoi de commande directement depuis le handler de clic
  // Plus de useEffect comme declencheur : evite la double soumission
  // et rend le flux de donnees explicite et lineaire
  const envoyerCommande = async (commande) => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/commandes`, {
        method: "POST",
        body: JSON.stringify(commande),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const savedCommande = await res.json();
      setOrderHistory((prev) => [savedCommande, ...prev]);
      setCart([]);
      showToast("Votre commande est bien reçu, veuillez patienter !", "success");
      oneclose();
    } catch {
      showToast("Erreur lors de l'envoi de la commande !", "error");
    } finally {
      setLoading(false);
    }
  };

  async function conditionalModal() {
    if (nameCash.trim() === "") {
      setConditionnameCash(true);
      return;
    }
    if (levelCash === "") {
      setConditionlevelCash(true);
      return;
    }
    if (
      !levelCash.trim().includes("L1") &&
      !levelCash.trim().includes("L2") &&
      !levelCash.trim().includes("L3")
    ) {
      setConditionlevelCash(true);
      return;
    }

    await envoyerCommande({
      clientNom: nameCash,
      niveau: levelCash,
      methodePaiement: "Cash",
      produits: cart,
      total: totalCommande,
      date: new Date(),
      statut: "en attente",
    });
  }

  async function conditionMvolaModal() {
    if (nameMvola.trim() === "") {
      setConditionnameMvola(true);
      return;
    }
    if (number.trim() === "") {
      setConditionnumMvola(true);
      return;
    }
    if (!number.trim().includes("034") && !number.trim().includes("038")) {
      setConditionnumMvola(true);
      return;
    }
    if (number.trim().length !== 10) {
      setConditionnumMvola(true);
      return;
    }

    await envoyerCommande({
      clientNom: nameMvola,
      numero: number,
      methodePaiement: "Mvola",
      produits: cart,
      total: totalCommande,
      date: new Date(),
      statut: "en attente",
    });
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
                <input type="text" size={30} required value={nameCash} onChange={(e) => setNameCash(e.target.value)} />
                <br />
                <label>Entrer votre niveau</label>
                {conditionlevelCash && <p className="errorModal" title="Entrer votre niveau">!</p>}
                <br />
                <input type="text" size={30} value={levelCash} onChange={(e) => setLevelCash(e.target.value)} required />
                <div className="date">
                  <h6>Vous devez payer dans les :</h6>
                  <p>10 prochain minutes</p>
                </div>
                <div className="btnSubmit">
                  <button id="SubmitBtn" onClick={conditionalModal} disabled={loading}>
                    {loading ? "Envoi..." : "Valider"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="inputText">
                {conditionnameMvola && <p className="erreurModal" title="Entrer un nom">!</p>}
                <label>Entrer votre Nom</label>
                <br />
                <input type="text" size={30} value={nameMvola} onChange={(e) => setNameMvola(e.target.value)} required />
                <br />
                {conditionnumMvola && <p className="erreurModal2" title="Entrer votre numero">!</p>}
                <label>Entrer votre numero Mvola</label>
                <br />
                <input type="tel" size={30} onChange={(e) => setNumber(e.target.value)} value={number} required />
                <div className="btnSubmit">
                  <button id="SubmitBtn" onClick={conditionMvolaModal} disabled={loading}>
                    {loading ? "Envoi..." : "Valider"}
                  </button>
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