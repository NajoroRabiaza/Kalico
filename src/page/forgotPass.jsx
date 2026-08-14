import API_URL from "../api";
import React, { useState } from "react";
import "./SignIn.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

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

      // Le backend envoie l'email avec le lien
      // On affiche juste une confirmation, le token n'est plus expose ici
      setSucces(true);

    } catch (error) {
      setMessage("Erreur serveur, veuillez reessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="SignIn_container">
        <div className="login-form-col">
          <div className="login-glass-card">
            <h2 className="login-titre">Mot de passe oublié ?</h2>

            {succes ? (
              <>
                <div className="login-succes">
                  Un email a ete envoye a <strong>{email}</strong>.
                  Verifiez votre boite de reception et cliquez sur le lien.
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.6)",
                  textAlign: "center",
                  margin: 0,
                }}>
                  Le lien expire dans 15 minutes.
                </p>
              </>
            ) : (
              <>
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
                  {loading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </>
            )}

            <p className="login-register">
              <Link to="/login">Retour a la connexion</Link>
            </p>
          </div>
        </div>

        <div className="divImage">
          <div>
            <img src="/image/image_chef.webp" alt="imageDechef" id="imgeLogin" />
          </div>
          <h2 style={{ color: "white", fontSize: "50px" }}>
            <strong>Kalⁱco</strong>
          </h2>
        </div>
      </div>

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