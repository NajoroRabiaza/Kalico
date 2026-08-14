import API_URL from "../api";
import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { useNavigate, Link } from "react-router-dom";

function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");
  const [eye, setEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const [succesConnect, setSuccesConnect] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [errnom, setErrnom] = useState(false);
  const [errEmailVide, setErrEmailvide] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [erreurpassword, setErreurpassword] = useState(false);
  const [errpasswordchar, setErrpasschar] = useState(false);
  const [errlevel, setErrlevel] = useState(false);

  const navigate = useNavigate();

  // Regex standard de validation d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const hasError = erreur || errlevel || errEmailVide || errEmail || erreurpassword || errpasswordchar || errnom;

  useEffect(() => {
    if (!hasError) return;
    const timer = setTimeout(() => {
      setErreur(false);
      setErrlevel(false);
      setErrEmailvide(false);
      setErrEmail(false);
      setErreurpassword(false);
      setErrpasschar(false);
      setErrnom(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasError]);

  const handleAdd = async () => {
    if (nom.trim() === "") { setErrnom(true); return; }
    if (email.trim() === "") { setErrEmailvide(true); return; }
    if (!emailRegex.test(email.trim())) { setErrEmail(true); return; }
    if (password.trim().length < 8) { setErreurpassword(true); return; }
    if (
      !password.includes("@") &&
      !password.includes("#") &&
      !password.includes("$") &&
      !password.includes("&") &&
      !password.includes("*")
    ) {
      setErrpasschar(true);
      return;
    }
    if (
      level.trim() !== "L1" &&
      level.trim() !== "L2" &&
      level.trim() !== "L3"
    ) {
      setErrlevel(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nom, email, level, password }),
      });
      await res.json();
      setSuccesConnect(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Erreur inscription :", error);
      setErreur(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setEye((prev) => !prev);

  return (
    <>
      <div className="SignIn_container">

        {/* Colonne gauche : formulaire dans une carte glassmorphism */}
        <div className="login-form-col">
          <div className="login-glass-card">
            <h2 className="login-titre">S'inscrire</h2>

            {succesConnect && (
              <div className="login-succes">Compte cree avec succes !</div>
            )}

            {/* Champ Nom */}
            <div className="login-field">
              <label className="login-label">Nom</label>
              <input
                type="text"
                className="login-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom"
              />
              {errnom && <p className="login-error">Entrez votre nom</p>}
              {erreur && <p className="login-error">Champ obligatoire</p>}
            </div>

            {/* Champ Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@domaine.com"
              />
              {errEmailVide && <p className="login-error">Entrez votre email</p>}
              {errEmail && <p className="login-error">Adresse email invalide</p>}
            </div>

            {/* Champ Mot de passe */}
            <div className="login-field">
              <label className="login-label">Mot de passe</label>
              <div className="login-password-wrapper">
                <input
                  type={eye ? "text" : "password"}
                  className="login-input login-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caracteres min. avec @ # $ & ou *"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={togglePassword}
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
              {erreurpassword && <p className="login-error">Minimum 8 caracteres</p>}
              {errpasswordchar && <p className="login-error">Entrez au moins un caractere : @ # $ & ou *</p>}
            </div>

            {/* Champ Niveau */}
            <div className="login-field">
              <label className="login-label">Niveau</label>
              <input
                type="text"
                className="login-input"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="L1, L2 ou L3"
              />
              {errlevel && <p className="login-error">Entrez un niveau valide : L1, L2 ou L3</p>}
            </div>

            {/* Bouton inscription */}
            <button
              onClick={handleAdd}
              disabled={loading}
              className="login-btn"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>

            <p className="login-register">
              Vous avez deja un compte ?{" "}
              <Link to="/login">Se connecter</Link>
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
}

export default Inscription;