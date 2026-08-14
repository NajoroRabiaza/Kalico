import API_URL from "../api";
import React, { useState } from "react";
import "./SignIn.css";
import { Link, useParams, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [updateSucces, setUpdateSucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.trim() === "") {
      setMessage("Entrez votre nouveau mot de passe");
      return;
    }

    if (newPassword.trim().length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ChangePass/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passChange: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Token invalide ou expire");
        return;
      }

      setUpdateSucces(true);
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMessage("Erreur lors de la mise a jour, veuillez reessayer");
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
            <h2 className="login-titre">Nouveau mot de passe</h2>

            {updateSucces && (
              <div className="login-succes">
                Mot de passe mis a jour ! Redirection...
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Nouveau mot de passe</label>
              <div className="login-password-wrapper">
                <input
                  type={eye ? "text" : "password"}
                  className="login-input login-input-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8 caracteres minimum"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setEye((prev) => !prev)}
                  aria-label={eye ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {eye ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {message && <p className="login-error">{message}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="login-btn"
            >
              {loading ? "Mise a jour..." : "Confirmer"}
            </button>

            <p className="login-register">
              <Link to="/forgotPassword">Retour</Link>
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

export default ChangePassword;