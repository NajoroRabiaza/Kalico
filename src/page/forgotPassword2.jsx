import API_URL from "../api";
import React, { useState } from "react";
import "./forgotPassword.css";
import { Link, useParams, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [updateSucces, setUpdateSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  // Le parametre est desormais le resetToken temporaire
  // et non plus l'_id permanent de l'utilisateur
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.trim() === "") {
      setMessage("Entrer votre nouveau mot de passe");
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
    <div className="ContainerForgot">
      {updateSucces && (
        <p className="SuccesConnexion">Mot de passe mis a jour avec succes !</p>
      )}
      <div style={{
        maxWidth: "400px", margin: "0 auto", height: "400px",
        width: "500px", border: "0.3px solid black", display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0px 0px 1px black",
      }}>
        <div style={{ height: "200px" }}>
          <h2 style={{ color: "white", position: "relative", bottom: "30px", textAlign: "center" }}>
            Nouveau mot de passe
          </h2>
          <br />
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrer votre nouveau mot de passe"
              style={{
                width: "100%", padding: "10px", marginTop: "5px",
                borderRadius: "5px", border: "1px solid #ccc",
                outline: "none", borderBottomColor: "black", background: "white",
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: "rgb(149, 11, 255, 1)",
              color: "white", padding: "10px 20px", marginTop: "20px",
              border: "none", borderRadius: "5px", cursor: loading ? "not-allowed" : "pointer",
              width: "100%", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Mise a jour..." : "Confirmer"}
          </button>
          <p></p>
          <Link to="/forgotPassword" style={{ color: "white" }}>Retour</Link>
          {message && (
            <p style={{ marginTop: "15px", color: "red" }}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;