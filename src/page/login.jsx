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

    // On envoie directement au backend, plus de fetch de tous les users
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Stockage du token et du level pour la protection des routes
          localStorage.setItem("token", data.token);
          localStorage.setItem("userLevel", data.user.level);
          localStorage.setItem("userName", data.user.name);

          setConnecte(true);
          setUserConnecte(true);
          setSuccesConnect(true);

          setTimeout(() => {
            // Redirection admin si level === "admin", sinon accueil
            if (data.user.level === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 1000);
        } else {
          // Le backend a répondu sans token : credentials incorrects
          setMissingpass(true);
        }
      })
      .catch(() => setErreur(true));
  }

  const togglePassword = () => setEye((prev) => !prev);

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
    return () => clearTimeout(timer); // cleanup pour eviter les fuites memoire
  }, [erreur, errEmail, errpassword, emailmissing, incorrectemail, missingpass, existename]);

  return (
    <>
      <div className="SignIn_container">
        <div>
          <div className="inputLogin">
            <h2
              style={{
                color: "white",
                fontSize: "60px",
                textAlign: "center",
                marginLeft: "70px",
                marginBottom: "30px",
              }}
            >
              <strong>Login</strong>
            </h2>
            <div className="inputName">
              <input
                type="text"
                className="nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                size={500}
              />
              <div className="underline"></div>
              {existename ? (
                <p className="compte_introuvable"> creer un compte</p>
              ) : succesConnect ? (
                <p className="SuccesConnexion"> Connexion reussit</p>
              ) : erreur ? (
                <p className="error">champ obligatoire !</p>
              ) : (
                erreunom && <p className="error">Entrer votre nom!</p>
              )}
              <label htmlFor="nom">Enter your name</label>
            </div>
            <br />
            <div className="inputName">
              <input
                type="text"
                className="emailLogin"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size={700}
              />
              <div className="underline"></div>
              {erreur ? (
                <p className="error">champ obligatoire !</p>
              ) : errEmail ? (
                <p className="error">Entrer votre email!</p>
              ) : emailmissing ? (
                <p className="error">@gmail.com obligatoire !</p>
              ) : (
                incorrectemail && <p className="error">@gmail.com obligatoire !</p>
              )}
              <label htmlFor="email">Enter your email</label>
            </div>
            <br />
            <div className="inputName">
              <input
                type={eye ? "text" : "password"}
                className="passwordLogin"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size={700}
              />
              <div className="underline"></div>
              {erreur ? (
                <p className="error">champ obligatoire !</p>
              ) : errpassword ? (
                <p className="error">Entrer votre mot de passe!</p>
              ) : (
                missingpass && <p className="error">mot de passe incorrecte!</p>
              )}
              <label htmlFor="email">Enter your password</label>
            </div>
            <button
              type="button"
              onClick={togglePassword}
              style={{
                height: "30px",
                width: "50px",
                backgroundColor: "#f3f4f66b",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}>
                {eye ? "hide" : "show"}
              </span>
            </button>
            <br />
            <div className="paragraphe">
              <p>
                Forgot password? <Link to={"/forgotPassword"}>click here</Link>
              </p>
            </div>
            <button onClick={handleclicLogin} className="btnLogin">
              Login
            </button>
            <div className="paragraphe">
              <p>
                Not registered? <Link to={"/SignUp"}>Create an account</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="divImage">
          <div>
            <img src="/image/image_chef.webp" alt="imageDechef" id="imgeLogin" />
          </div>
          <h2
            style={{
              color: "white",
              position: "relative",
              right: "10px",
              fontSize: "50px",
            }}
          >
            {" "}
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
}

export default Loginpage;
