import API_URL from "../api";
import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { useNavigate, Link } from "react-router-dom";

function Inscription() {
  const [newnom, setNewnom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [newemail, setnewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [level, setLevel] = useState("");
  const [newlevel, setnewLevel] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [erreurpassword, setErreurpassword] = useState(false);
  const [errlevel, setErrlevel] = useState(false);
  const [errnom, setErrnom] = useState(false);
  const [errEmailVide, setErrEmailvide] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errpasswordchar, setErrpasschar] = useState(false);
  const [eye, setEye] = useState(false);

  const navigate = useNavigate();

  const hasError = erreur || errlevel || errEmailVide || errEmail || erreurpassword || errpasswordchar;

  // Cache tous les messages d'erreur apres 8 secondes
  // Encapsule dans useEffect pour eviter de relancer le timer a chaque re-render
  useEffect(() => {
    if (!hasError) return;
    const timer = setTimeout(() => {
      setErreur(false);
      setErrlevel(false);
      setErrEmailvide(false);
      setErrEmail(false);
      setErreurpassword(false);
      setErrpasschar(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasError]);

  // Redirige vers login apres inscription reussie
  // Le cleanup annule la redirection si le composant est demonte avant 1s
  useEffect(() => {
    if (!connecte) return;
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [connecte, navigate]);

  function handleAdd() {
    if (
      nom.trim() === "" &&
      email.trim() === "" &&
      password.trim() === "" &&
      level.trim() === ""
    ) {
      setErreur(true);
    } else if (password.trim().length < 8) {
      setErreurpassword(true);
    } else if (
      password.trim().includes("@") ||
      password.trim().includes("#") ||
      password.trim().includes("$") ||
      password.trim().includes("&") ||
      password.trim().includes("*")
    ) {
      if (nom.trim() === "") {
        setErrnom(true);
      } else if (email.trim() === "") {
        setErrEmailvide(true);
      } else if (level.trim() === "") {
        setErrlevel(true);
      } else if (
        level.trim() !== "L1" &&
        level.trim() !== "L2" &&
        level.trim() !== "L3"
      ) {
        setErrlevel(true);
      } else if (!email.trim().includes("@gmail.com")) {
        setErrEmail(true);
      } else {
        setErreur(false);
        setNewnom(nom);
        setnewEmail(email);
        setnewPassword(password);
        setnewLevel(level);
        setConnecte(true);
      }
    } else {
      setErreur(false);
      setErrpasschar(true);
    }
  }

  function handlchange(event) { setNom(event.target.value); }
  function handlchangeemail(event) { setEmail(event.target.value); }
  function handlchangepassword(event) { setPassword(event.target.value); }
  const handlchangeLevel = (event) => { setLevel(event.target.value); };
  const togglePassword = () => setEye((prev) => !prev);

  // Envoi des donnees d'inscription au backend
  // Se declenche uniquement quand newnom change, c'est-a-dire apres validation complete
  useEffect(() => {
    if (!newnom) return;
    const inputData = async () => {
      try {
        const dataSend = await fetch(`${API_URL}/signup`, {
          method: "POST",
          mode: "cors",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: newnom,
            email: newemail,
            level: newlevel,
            password: newpassword,
          }),
        });
        await dataSend.json();
      } catch (error) {
        console.error("Erreur inscription :", error);
      }
    };
    inputData();
  }, [newnom]);

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
              <strong>S'inscrire</strong>
            </h2>
            <div className="inputName">
              <input
                type="text"
                className="nom"
                value={nom}
                onChange={handlchange}
                required
                size={800}
              />
              {erreur ? (
                <p className="error" title="champ obligatoire">champ obligatoire</p>
              ) : connecte ? (
                <p className="SuccesConnexion">Compte creer avec succes</p>
              ) : (
                errnom && <p className="error" title="Entrer un nom">Entrer un nom</p>
              )}
              <div className="underline"></div>
              <label htmlFor="nom">Entrer votre nom</label>
            </div>
            <br />
            <div className="inputName">
              <input
                type="email"
                className="email"
                value={email}
                onChange={handlchangeemail}
                required
              />
              {erreur ? (
                <p className="error" title="champ obligatoire">Champ obligatoire</p>
              ) : errEmail ? (
                <p className="error" title="il manque @gmail.com">il manque @gmail.com</p>
              ) : (
                errEmailVide && <p className="error" title="entrer votre email">entrer votre email</p>
              )}
              <div className="underline"></div>
              <label htmlFor="email">Entrer votre email</label>
            </div>
            <br />
            <div className="inputName">
              <input
                type={eye ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={handlchangepassword}
              />
              {erreur ? (
                <p className="error" title="champ obligatoire">Champ obligatoires</p>
              ) : erreurpassword ? (
                <p className="error" title="mot de passe incorrecte">mot de passe incorrecte!</p>
              ) : (
                errpasswordchar && (
                  <p className="error" title="caractere specifique requis">
                    Entrer au moin 1:@ ou # ou $ ou & ou *
                  </p>
                )
              )}
              <div className="underline"></div>
              <label htmlFor="password">Crée votre mot de passe</label>
            </div>
            <button
              type="button"
              onClick={togglePassword}
              style={{
                height: "30px",
                width: "50px",
                backgroundColor: "#f3f4f657",
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
            <div className="inputName">
              <input
                type="text"
                className="level"
                required
                value={level}
                onChange={handlchangeLevel}
              />
              {erreur ? (
                <p className="error" title="champ obligatoire">Champ obligatoire</p>
              ) : (
                errlevel && (
                  <p className="error" title="Enter un niveau L1,L2 or L3">
                    Enter one level with L1, L2 or L3!
                  </p>
                )
              )}
              <div className="underline"></div>
              <label htmlFor="level">Entrer votre niveau</label>
            </div>
            <br />
            <button className="btnLogin" onClick={handleAdd}>
              <h5 style={{ fontSize: "35px" }}>Sign up</h5>
            </button>
            <div className="paragraphe">
              <p>
                Do you have an account? <Link to={"/login"}>clic here</Link>
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

export default Inscription;