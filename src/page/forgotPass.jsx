import API_URL from "../api";
import React, { useState } from "react";
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMessage("Entrez votre email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Email introuvable");
        return;
      }

      navigate(`/ChangePassword/${data.resetToken}`);

    } catch (error) {
      setMessage("Erreur serveur, veuillez reessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="SignIn_container">

        {/* Colonne gauche : formulaire glassmorphism */}
        <div className="login-form-col">
          <div className="login-glass-card">
            <h2 className="login-titre">Mot de passe oublié ?</h2>

            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              textAlign: "center",
            }}>
              Entrez votre email pour recevoir un lien de reinitialisation.
            </p>

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@domaine.com"
              />
              {message && <p className="login-error">{message}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="login-btn"
            >
              {loading ? "Verification..." : "Soumettre"}
            </button>

            <p className="login-register">
              <Link to="/login">Retour a la connexion</Link>
            </p>
          </div>
        </div>

        {/* Colonne droite : logo chef */}
        <div className="divImage">
          <div>
            <img src="/image/image_chef.webp" alt="imageDechef" id="imgeLogin" />
          </div>
          <h2 style={{ color: "white", fontSize: "50px" }}>
            <strong>Kalⁱco</strong>
          </h2>
        </div>
      </div>

      {/* Ronds animes */}
      <div className="Rcontener">
        <img src="/image/b.webp" alt="0" className="rond1" />
        <img src="/image/b (2).webp" alt="0" className="rond2" />
        <img src="/image/b (3).webp" alt="0" className="rond3" />
        <img src="/image/b (4).webp" alt="0" className="rond4" />
        <img src="/image/b (5).webp" alt="0" className="rond5" />
      </div>
    </>
  );
};

export default ForgotPassword;