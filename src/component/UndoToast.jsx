import { useEffect, useState } from "react";
import "./UndoToast.css";

/**
 * Toast de confirmation de suppression avec bouton Annuler.
 * Affiche une barre de progression qui se vide en 5 secondes.
 * Appelle onUndo si l'utilisateur clique Annuler avant expiration.
 * Appelle onDismiss si l'utilisateur ferme manuellement.
 */
function UndoToast({ item, onUndo, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(show);
  }, []);

  if (!item) return null;

  return (
    <div className={`undo-toast ${visible ? "undo-toast--visible" : ""}`} role="status">
      <div className="undo-toast-body">
        <p className="undo-toast-text">
          <span className="undo-toast-name">{item.nom}</span> retiré du panier
        </p>
        <div className="undo-toast-actions">
          <button
            type="button"
            className="undo-toast-btn"
            onClick={onUndo}
          >
            Annuler
          </button>
          <button
            type="button"
            className="undo-toast-close"
            onClick={onDismiss}
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" className="undo-toast-close-icon" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="undo-toast-progress">
        <div className={`undo-toast-bar ${visible ? "undo-toast-bar--running" : ""}`} />
      </div>
    </div>
  );
}

export default UndoToast;