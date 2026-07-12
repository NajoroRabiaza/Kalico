import { useEffect, useRef, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CommandeDetailModal from "./CommandeDetailModal";
import authFetch from "../utils/authFetch";
import API_URL from "../api";
import "./dropdown.css";

export default function SimpleDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const { orderHistory, setOrderHistory } = useContext(CartContext);

  const fetchCommandes = () => {
    setIsLoading(true);
    // Le setTimeout artificiel de 1000ms a ete supprimer
    // Il n'avait aucun role technique et degradait l'user experience
    authFetch(`${API_URL}/commandes`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrderHistory(sorted);
        }
      })
      .catch((err) => console.error("Erreur récupération commandes :", err))
      .finally(() => {
        setIsLoading(false);
        setOpen(true);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    if (!open) {
      fetchCommandes();
    } else {
      setOpen(false);
    }
  };

  const handleCommandeClick = (commande) => setSelectedCommande(commande);
  const closeModal = () => setSelectedCommande(null);

  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>
      <button className="dropdown-button" onClick={handleToggleDropdown}>
        Vos commandes
      </button>

      {isLoading && <p className="loading">Chargement des commandes...</p>}

      <ul className={`value-list ${open ? "open" : ""}`}>
        {orderHistory.map((commande, index) => (
          <li
            key={commande._id || index}
            onClick={() => handleCommandeClick(commande)}
            style={{ cursor: "pointer" }}
            title="cliquez pour plus de details"
          >
            Votre Commande #{index + 1} est {commande.statut || "en attente"}
          </li>
        ))}
      </ul>

      {selectedCommande && (
        <CommandeDetailModal commande={selectedCommande} onClose={closeModal} />
      )}
    </div>
  );
}