import API_URL from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";

function Loginpage({ setUserConnecte }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [existename, setExistname] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [erreunom, setErreurnom] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errpassword, setErreurpassword] = useState(false);
  const [emailmissing, setEmailmissing] = useState(false);
  const [missingpass, setMissingpass] = useState(false);
  const [incorrectemail, setIncorrectemail] = useState(false);
  const [succesConnect, setSuccesConnect] = useState(false);
  const [eye, setEye] = useState(false);
  const [redirectData, setRedirectData] = useState(null);

  const navigate = useNavigate();

  function handleclicLogin() {
    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      setErreur(true);
      return;
    }
    if (name.trim() === "") { setErreurnom(true); return; }
    if (email.trim() === "") { setErrEmail(true); return; }
    if (password.trim() === "") { setErreurpassword(true); return; }
    if (!email.trim().includes("@gmail.com")) { setEmailmissing(true); return; }

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userLevel", data.user.level);
          localStorage.setItem("userName", data.user.name);
          setConnecte(true);
          setUserConnecte(true);
          setSuccesConnect(true);
          setRedirectData(data.user.level);
        } else {
          setMissingpass(true);
        }
      })
      .catch(() => setErreur(true));
  }

  useEffect(() => {
    if (!redirectData) return;
    const timer = setTimeout(() => {
      if (redirectData === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [redirectData, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErreur(false);
      setErrEmail(false);
      setErreurpassword(false);
      setEmailmissing(false);
      setConnecte(false);
      setIncorrectemail(false);
      setMissingpass(false);
      setExistname(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [erreur, errEmail, errpassword, emailmissing, incorrectemail, missingpass, existename]);

  const togglePassword = () => setEye((prev) => !prev);

  return (
    <>
      <div className="SignIn_container">

        {/* Colonne gauche : formulaire dans une carte glassmorphism */}
        <div className="login-form-col">
          <div className="login-glass-card">
            <h2 className="login-titre">Login</h2>

            {/* Message succes */}
            {succesConnect && (
              <div className="login-succes">Connexion réussie !</div>
            )}

            {/* Champ Nom */}
            <div className="login-field">
              <label className="login-label">Nom</label>
              <input
                type="text"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
              />
              {erreunom && <p className="login-error">Entrez votre nom</p>}
              {erreur && <p className="login-error">Champ obligatoire</p>}
            </div>

            {/* Champ Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="text"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
              />
              {errEmail && <p className="login-error">Entrez votre email</p>}
              {emailmissing && <p className="login-error">@gmail.com obligatoire</p>}
              {erreur && <p className="login-error">Champ obligatoire</p>}
            </div>

            {/* Champ Mot de passe avec icone oeil integree */}
            <div className="login-field">
              <label className="login-label">Mot de passe</label>
              <div className="login-password-wrapper">
                <input
                  type={eye ? "text" : "password"}
                  className="login-input login-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                />
                {/* Icone oeil integrée dans le champ, pas de bouton externe */}
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
              {errpassword && <p className="login-error">Entrez votre mot de passe</p>}
              {missingpass && <p className="login-error">Mot de passe incorrect</p>}
              {erreur && <p className="login-error">Champ obligatoire</p>}
            </div>

            {/* Lien mot de passe oublie */}
            <div className="login-forgot">
              <Link to="/forgotPassword">Mot de passe oublié ?</Link>
            </div>

            {/* Bouton Login */}
            <button onClick={handleclicLogin} className="login-btn">
              Se connecter
            </button>

            {/* Lien inscription */}
            <p className="login-register">
              Pas encore de compte ?{" "}
              <Link to="/SignUp">Créer un compte</Link>
            </p>
          </div>
        </div>

        {/* Colonne droite : logo chef - non modifie */}
        <div className="divImage">
          <div>
            <img src="/image/image_chef.webp" alt="imageDechef" id="imgeLogin" />
          </div>
          <h2 style={{ color: "white", position: "relative", right: "10px", fontSize: "50px" }}>
            <strong>Kalⁱco</strong>
          </h2>
        </div>
      </div>

      {/* Ronds animés - non modifies */}
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

export default Loginpage;
