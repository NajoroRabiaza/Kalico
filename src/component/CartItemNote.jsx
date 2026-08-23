import { useState } from "react";
import "./CartItemNote.css";

/**
 * Accordeon discret pour ajouter une instruction de cuisine sur un article.
 * L'etat note est gere localement et remonte vers le parent via onNoteChange.
 * Le parent (Panier) doit stocker ces notes dans le cart state pour les
 * inclure dans le payload de commande envoye au backend.
 */
function CartItemNote({ itemId, onNoteChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setNote(value);
    onNoteChange(itemId, value);
  };

  return (
    <div className="cart-note">
      <button
        type="button"
        className="cart-note-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cart-note-icon"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{isOpen ? "Masquer la note" : "Ajouter une instruction"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`cart-note-chevron ${isOpen ? "cart-note-chevron--open" : ""}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <input
          type="text"
          value={note}
          onChange={handleChange}
          placeholder="ex : sans piment, sauce à part, bien cuit..."
          className="cart-note-input"
          maxLength={120}
        />
      )}
    </div>
  );
}

export default CartItemNote;
