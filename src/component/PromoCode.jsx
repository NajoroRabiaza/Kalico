import { useState } from "react";
import "./PromoCode.css";

/**
 * Accordeon code promo dans la carte resume.
 * onApply(code) est appele par le parent quand l'utilisateur
 * soumet un code — le parent gere la validation cote backend
 * et peut passer un etat d'erreur ou de succes en retour.
 */
function PromoCode({ onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Entrez un code promo.");
      return;
    }
    setError("");
    onApply(trimmed);
  };

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="promo">
      <button
        type="button"
        className="promo-trigger"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setError("");
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
            />
            <button
              type="button"
              className="promo-btn"
              onClick={handleSubmit}
            >
              Appliquer
            </button>
          </div>
          {error && (
            <p className="promo-error" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PromoCode;
