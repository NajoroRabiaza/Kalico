import { useState } from "react";
import "./PromoCode.css";

/**
 * Accordeon code promo dans la carte resume.
 * onApply(code) est async — retourne { ok, message } depuis le parent.
 * onReset() retire la promo appliquee.
 * loading indique qu'une requete est en cours.
 * appliquee est l'objet promo actif ou null.
 */
function PromoCode({ onApply, onReset, loading, appliquee }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [succes, setSucces] = useState("");

  const handleSubmit = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Entrez un code promo.");
      return;
    }
    setError("");
    setSucces("");
    const result = await onApply(trimmed);
    if (result.ok) {
      setSucces(result.message);
      setCode("");
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError("");
    if (succes) setSucces("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleReset = () => {
    onReset();
    setCode("");
    setError("");
    setSucces("");
    setIsOpen(false);
  };

  // Si une promo est deja appliquee, afficher le badge de succes avec bouton retrait
  if (appliquee) {
    return (
      <div className="promo">
        <div className="promo-appliquee">
          <span className="promo-appliquee-label">
            Code{" "}
            <strong>{appliquee.code}</strong> applique
          </span>
          <button
            type="button"
            className="promo-retirer-btn"
            onClick={handleReset}
          >
            Retirer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="promo">
      <button
        type="button"
        className="promo-trigger"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setError("");
          setSucces("");
        }}
        aria-expanded={isOpen}
      >
        Vous avez un code promo ?
      </button>

      {isOpen && (
        <div className="promo-body">
          <div className="promo-row">
            <input
              type="text"
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="CODE"
              className={`promo-input ${error ? "promo-input--error" : ""}`}
              maxLength={32}
              autoFocus
              disabled={loading}
            />
            <button
              type="button"
              className="promo-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "..." : "Appliquer"}
            </button>
          </div>
          {error && (
            <p className="promo-error" role="alert">
              {error}
            </p>
          )}
          {succes && (
            <p className="promo-succes" role="status">
              {succes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PromoCode;