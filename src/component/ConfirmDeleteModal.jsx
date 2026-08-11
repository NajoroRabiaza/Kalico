import { createPortal } from "react-dom";
import "./ConfirmDeleteModal.css";

// Modal de confirmation de suppression
// Apparait avant de retirer definitivement un article du panier
function ConfirmDeleteModal({ itemName, onConfirm, onCancel }) {
  return createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icone avertissement */}
        <div className="confirm-icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="confirm-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h3 className="confirm-titre">Retirer cet article ?</h3>
        <p className="confirm-texte">
          Voulez-vous retirer <strong>{itemName}</strong> de votre panier ?
        </p>

        <div className="confirm-actions">
          <button className="confirm-btn-annuler" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm-btn-supprimer" onClick={onConfirm}>
            Retirer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDeleteModal;