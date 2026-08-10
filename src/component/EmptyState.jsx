import React from "react";
import "./EmptyState.css";

// Composant reutilisable pour tous les etats vides de l'application
// Affiche une icone, un message clair et un bouton d'action pour debloquer l'utilisateur
function EmptyState({ query, onReset }) {
  return (
    <div className="empty-state">
      {/* Icone loupe SVG inline : pas de dependance externe requise */}
      <svg
        className="empty-state-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 15l2 2"
        />
      </svg>

      <h3 className="empty-state-title">Aucun produit trouvé</h3>

      {query && (
        <p className="empty-state-subtitle">
          Aucun résultat pour <strong>« {query} »</strong>
        </p>
      )}

      <p className="empty-state-hint">
        Essayez un autre mot-clé ou explorez nos catégories.
      </p>

      {/* Bouton reset : efface la recherche et ramene l'utilisateur au menu */}
      <button className="empty-state-btn" onClick={onReset}>
        Effacer la recherche
      </button>
    </div>
  );
}

export default EmptyState;
