import API_URL from "../api";
import { useEffect, useRef, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CommandeDetailModal from "./CommandeDetailModal";
import "./dropdown.css";

export default function SimpleDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // etat de chargement
  const wrapperRef = useRef(null);
  const { orderHistory, setOrderHistory } = useContext(CartContext);

  const fetchCommandes = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetch(`${API_URL}/commandes`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // Trier par date decroissante (plus recent en premier)
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrderHistory(sorted);
          }
        })
        .catch((err) =>
          console.error("Erreur récupération commandes :", err)
        )
        .finally(() => {
          setIsLoading(false);
          setOpen(true);
        });
    }, 1000);
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
      fetchCommandes(); // lancer fetch avec délai 1000ms si il est fermé
    } else {
      setOpen(false); // fermer normalement
    }
  };

  const handleCommandeClick = (commande) => {
    setSelectedCommande(commande);
  };

  const closeModal = () => {
    setSelectedCommande(null);
  };

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
          title="cliquez pour plus de details">
            Votre Commande #{index + 1} est {" "} 
            {commande.statut || "en attente"}
          </li> // retriage
        ))}
      </ul>

      {selectedCommande && (
        <CommandeDetailModal commande={selectedCommande} onClose={closeModal} />
      )}
    </div>
  );
}
