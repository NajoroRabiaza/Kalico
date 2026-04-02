import API_URL from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";

function Loginpage({ setUserConnecte }) {
  const [name, setName] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginemail, SetLoginemail] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [data, setData] = useState([]);
  const [existename, setExistname] = useState(false);

  //Eto no nataoko ilay erreur rehetra
  const [erreur, setErreur] = useState(false);
  const [erreunom, setErreurnom] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errpassword, setErreurpassword] = useState(false);
  //Eto indray erreur an' ilay hoe ts misy @gmail.com
  const [emailmissing, setEmailmissing] = useState(false);
  const [missingpass, setMissingpass] = useState(false);
  const [incorrectemail, setIncorrectemail] = useState(false);
  const [succesConnect, setSuccesConnect] = useState(false);

  //Staten' le maso @ password iny
  const [eye, setEye] = useState(false);


  //Eto no mi naviguer ilay izy

  const navigate = useNavigate();
  function navigation(path) {
    navigate(path);
  }

  useEffect(() => {
    const dataComparing = async () => {
      try {
        const datafetching = await fetch(`${API_URL}/dataUser`, {
          method: "GET",
        });
        const donnefetch = await datafetching.json();
        //console.log(donnefetch[0].name);
        setData(donnefetch);
      } catch (error) {
        console.log("Une erreur c' est produit!");
      }
    };
    dataComparing();
    //console.log(data[0].email);
  }, [data]);

  function handleclicLogin() {
    console.log(data);
    //console.log(data[1].email);

    //Eto no manao condition de login
    let j = 0;

    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      /* alert("Entrer les champs") */
      setErreur(true);
    } else if (name.trim() == "") {
      setErreurnom(true);
    } else if (email.trim() == "") {
      /* alert("Entrer votre email") */
      setErrEmail(true);
    } else if (password.trim() == "") {
      /*  alert("Entrer votre mot de passe!") */
      setErreurpassword(true);
    } else if (!email.trim().includes("@gmail.com")) {
      setEmailmissing(true);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          setExistname(false);
          j = i;
          break;
        } else {
          setExistname(true)
        }
      }
    }
    if (existename == false) {
      /*  alert("Votre compte existe!"); */
      if (data[j].email === email) {

        if (data[j].password === password) {
          /* alert("Votre mot de passe est correcte vous ete connecte") */
          setConnecte(true);
          setUserConnecte(true);
        } else {
          /* alert("Votre mot de passe est incorrecte!") */
          setMissingpass(true)
        }
      } else {

        setIncorrectemail(true)
      }
    }

    else {
      /* alert("compte innexistant creer un compte") */
      setExistname(true)
      setUserConnecte(false);
    }
    console.log(j);
  }
  /*  j++; */




  function handlchangename(event) {
    setName(event.target.value);
  }

  function handlchangepassword(event) {
    setPassword(event.target.value);
  }

  function handlechangeEmail(event) {
    setEmail(event.target.value);
  }
  function eyefunc() {
    setEye(true);
  }

  setTimeout(() => {
    /*    setExistname(false); */
    setErreur(false);
    setErrEmail(false);
    setErreurpassword(false);
    setEmailmissing(false);
    setConnecte(false);
    setIncorrectemail(false);

  }, 8000);

  useEffect(() => {
    if (connecte === true) {
      setLoginUser(name);
      setLoginPassword(password);
      SetLoginemail(email);
      const loginBackend = async () => {
        try {
          const fetchDatalogin = await fetch(`${API_URL}/login`, {
            method: "POST",
            mode: "cors",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              password: password,
              email: email,
            }),
          });
        } catch (error) { }
      };
      loginBackend();
      setSuccesConnect(true);

      /* alert("Connexion reussit") */
      setTimeout(() => {
        navigation("/");
      }, 1000);
    }
  }, [connecte]);

  const togglePassword = () => {
    setEye(prev => !prev);
  
  };


  // Export du state 'connecte' vers le composant Navbar via props
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
                onChange={handlchangename}
                required
                size={500}
              />
              <div className="underline"></div>
              {existename ? (
                <p className="compte_introuvable"> creer un compte</p>
              ) : succesConnect ? (
                <p className="SuccesConnexion"> Connexion reussit</p>
              ) : erreur ? (
                <p className="error" title="champ obligatoire ">
                  champ obligatoire !
                </p>
              ) : (
                erreunom && (
                  <p className="error" title="Entrer votre nom">
                    Entrer votre nom!
                  </p>
                )
              )}
              <label htmlFor="nom">Enter your name</label>
            </div>
            <br />
            <div className="inputName">
              <input
                type="text   "
                className="emailLogin"
                required
                value={email}
                onChange={handlechangeEmail}
                size={700}
              />

              <div className="underline"></div>
              {erreur ? (
                <p className="error" title="champ obligatoire ">
                  champ obligatoire !
                </p>
              ) : errEmail ? (
                <p className="error" title="Entrer votre email!">
                  Entrer votre email!
                </p>
              ) : emailmissing ? (
                <p
                  className="error"
                  title="Votre adresse email doit etre suivis d' un @gmail.com"
                >
                  @gmail.com obligatoire  !
                </p>
              ) : (
                incorrectemail && (
                  <p
                    className="error"
                    title="Votre adresse email doit etre suivis d' un @gmail.com"
                  >
                    @gmail.com obligatoire !
                  </p>
                )
              )}
              <label htmlFor="email">Enter your email</label>
            </div>

            <br />
            <div className="inputName">
              {/*    <button onClick={eyefunc}><img src="#" alt="" /></button>  */}
              <input
                type={(eye) ? 'text' : 'password'}
                className="passwordLogin"
                required
                value={password}
                onChange={handlchangepassword}
                size={700}
              />



              <div className="underline"></div>

              <div className="underline"></div>

              {erreur ? (
                <p className="error" title="champ obligatoire ">
                  champ obligatoire !
                </p>
              ) : errpassword ? (
                <p className="error" title="Votre mot de passe est incorrecte">
                  Entrer votre mot de passe!
                </p>
              ) : (
                missingpass && (
                  <p
                    className="error"
                    title="Votre mot de passe est incorrecte"
                  >
                    mot de passe incorrecte!
                  </p>
                )
              )}
              <label htmlFor="email">Enter your password</label>
            </div>
            <button
              type="button"
              onClick={togglePassword}
              style={{
                height:"30px",
                width:"50px",
                backgroundColor: '#f3f4f66b',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {eye ? (
                <span style={{ color: 'white', fontWeight: 'bold',fontSize:"10px" }}>hide</span>
              ) : (
                <span style={{ color: 'white', fontWeight: 'bold',fontSize:"10px" }}>show</span>
              )}
            </button><br />
            <div className="paragraphe">
              <p>
                Forgot password? <Link to={"/forgotPassword"}> click here</Link>
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
            <img
              src="src/image/image_chef.png"
              alt="imageDechef"
              id="imgeLogin"
            />
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
        <img src="src/image/b.png" alt="0" className="rond1" />
        <img src="src/image/b (2).png" alt="0" className="rond2" />
        <img src="src/image/b (3).png" alt="0" className="rond3" />
        <img src="src/image/b (4).png" alt="0" className="rond4" />
        <img src="src/image/b (5).png" alt="0" className="rond5" />
      </div>
    </>
  );
}
export default Loginpage;
