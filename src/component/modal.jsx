import API_URL from "../api";
import authFetch from "../utils/authFetch";
import { useContext, useEffect, useState } from "react";
import "./modal.css";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/formatPrice";

// Regex identique a celle du backend — 034 ou 038 suivi de 7 chiffres
const MVOLA_REGEX = /^03[48]\d{7}$/;

function Modal({ oneclose, totalCommande }) {
  const { cart, setCart, setOrderHistory } = useContext(CartContext);
  const [showCash, setShowCash] = useState(true);
  const { showToast } = useToast();

  const [nameCash, setNameCash] = useState("");
  const [levelCash, setLevelCash] = useState("");
  const [nameMvola, setNameMvola] = useState("");
  const [number, setNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const [erreurNomCash, setErreurNomCash] = useState("");
  const [erreurNiveauCash, setErreurNiveauCash] = useState("");
  const [erreurNomMvola, setErreurNomMvola] = useState("");
  const [erreurNumMvola, setErreurNumMvola] = useState("");

  // Cache les messages d'erreur apres 8 secondes
  useEffect(() => {
    const hasError = erreurNomCash || erreurNiveauCash || erreurNomMvola || erreurNumMvola;
    if (!hasError) return;
    const timer = setTimeout(() => {
      setErreurNomCash("");
      setErreurNiveauCash("");
      setErreurNomMvola("");
      setErreurNumMvola("");
    }, 8000);
    return () => clearTimeout(timer);
  }, [erreurNomCash, erreurNiveauCash, erreurNomMvola, erreurNumMvola]);

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
      showToast("Votre commande est bien recu, veuillez patienter !", "success");
      oneclose();
    } catch {
      showToast("Erreur lors de l'envoi de la commande !", "error");
    } finally {
      setLoading(false);
    }
  };

  async function soumettreCash() {
    if (nameCash.trim() === "") {
      setErreurNomCash("Veuillez entrer votre nom.");
      return;
    }
    const niveau = levelCash.trim().toUpperCase();
    if (!niveau || (!niveau.includes("L1") && !niveau.includes("L2") && !niveau.includes("L3"))) {
      setErreurNiveauCash("Niveau invalide. Entrez L1, L2 ou L3.");
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

  async function soumettreMvola() {
    if (nameMvola.trim() === "") {
      setErreurNomMvola("Veuillez entrer votre nom.");
      return;
    }
    if (!MVOLA_REGEX.test(number.trim())) {
      setErreurNumMvola("Numero invalide. Format attendu : 034XXXXXXX ou 038XXXXXXX.");
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
          <button
            type="button"
            className="modal-close-btn"
            onClick={oneclose}
            aria-label="Fermer la fenetre de paiement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="modal-close-icon"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="butonPayment">
            <button
              type="button"
              onClick={() => setShowCash(true)}
              className={`cashPay ${showCash ? "active" : ""}`}
            >
              <img src="/image/imageMoney.webp" alt="imageCash" /> | Cash
            </button>
            <button
              type="button"
              onClick={() => setShowCash(false)}
              className={`MvolaPay ${!showCash ? "active" : ""}`}
            >
              <img src="/image/MvolaImage.webp" alt="imageMvola" /> | Mvola
            </button>

            {showCash ? (
              <div className="inputText">
                <label htmlFor="nameCash">Entrer votre Nom</label>
                {erreurNomCash && (
                  <p className="modal-erreur" role="alert">{erreurNomCash}</p>
                )}
                <input
                  id="nameCash"
                  type="text"
                  size={30}
                  value={nameCash}
                  onChange={(e) => {
                    setNameCash(e.target.value);
                    if (erreurNomCash) setErreurNomCash("");
                  }}
                />
                <label htmlFor="levelCash">Entrer votre niveau</label>
                {erreurNiveauCash && (
                  <p className="modal-erreur" role="alert">{erreurNiveauCash}</p>
                )}
                <input
                  id="levelCash"
                  type="text"
                  size={30}
                  value={levelCash}
                  onChange={(e) => {
                    setLevelCash(e.target.value);
                    if (erreurNiveauCash) setErreurNiveauCash("");
                  }}
                />
                <div className="date">
                  <h6>Vous devez payer dans les :</h6>
                  <p>10 prochain minutes</p>
                </div>
                <div className="btnSubmit">
                  <button
                    id="SubmitBtn"
                    type="button"
                    onClick={soumettreCash}
                    disabled={loading}
                  >
                    {loading ? "Envoi..." : "Valider"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="inputText">
                <label htmlFor="nameMvola">Entrer votre Nom</label>
                {erreurNomMvola && (
                  <p className="modal-erreur" role="alert">{erreurNomMvola}</p>
                )}
                <input
                  id="nameMvola"
                  type="text"
                  size={30}
                  value={nameMvola}
                  onChange={(e) => {
                    setNameMvola(e.target.value);
                    if (erreurNomMvola) setErreurNomMvola("");
                  }}
                />
                <label htmlFor="numMvola">Entrer votre numero Mvola</label>
                {erreurNumMvola && (
                  <p className="modal-erreur" role="alert">{erreurNumMvola}</p>
                )}
                <input
                  id="numMvola"
                  type="tel"
                  size={30}
                  value={number}
                  placeholder="034XXXXXXX ou 038XXXXXXX"
                  onChange={(e) => {
                    setNumber(e.target.value);
                    if (erreurNumMvola) setErreurNumMvola("");
                  }}
                />
                <div className="btnSubmit">
                  <button
                    id="SubmitBtn"
                    type="button"
                    onClick={soumettreMvola}
                    disabled={loading}
                  >
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
              <h4>Total : {formatPrice(totalCommande)}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;