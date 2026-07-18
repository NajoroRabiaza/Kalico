import API_URL from "../api";
import React, { useState } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // On envoie uniquement l'email au backend qui fait la recherche
  // Le backend retourne l'id si l'email existe, sans exposer les autres utilisateurs
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMessage("Entrer votre email");
      return;
    }

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

      // Redirection vers la page de changement de mot de passe avec l'id
      navigate(`/ChangePassword/${data.id}`);

    } catch (error) {
      setMessage("Erreur serveur, veuillez reessayer");
    }
  };

  return (
    <>
      <div className="ContainerForgot">
        <div style={{
          maxWidth: "400px", margin: "0 auto", height: "400px",
          width: "500px", border: "0.3px solid black", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0px 0px 1px black",
        }}>
          <div style={{ height: "200px" }}>
            <h2 style={{ color: "white", position: "relative", bottom: "30px" }}>
              Mot de passe oublier ?
            </h2>
            <br />
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrer votre email"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  borderBottomColor: "black",
                  background: "white",
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "rgb(149, 11, 255, 1)",
                color: "white",
                padding: "10px 20px",
                marginTop: "20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Soumettre
            </button>
            <p></p>
            <Link to={"/login"} style={{ color: "white" }}>Retour</Link>
            {message && (
              <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;