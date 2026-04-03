import React, { useEffect, useRef } from "react";
import "./CommandeDetailModal.css";

function CommandeDetailModal({ commande, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h3>Détails de la commande</h3>
        <p><strong>Nom :</strong> {commande.clientNom}</p>

        {commande.methodePaiement === "Cash" && (
          <p><strong>Niveau :</strong> {commande.niveau}</p>
        )}

        {commande.methodePaiement === "Mvola" && (
          <p><strong>Numéro Mvola :</strong> {commande.numero}</p>
        )}

        <p><strong>Mode de paiement :</strong> {commande.methodePaiement}</p>
        <p><strong>Total :</strong> {commande.total} Ariary</p>

        <h4>Produits :</h4>
        <ul>
          {commande.produits.map((prod, idx) => (
            <li key={idx}>
              {prod.nom} x {prod.quantity} - {prod.prix} Ar
            </li>
          ))}
        </ul>
        {commande.methodePaiement === "Cash" && (
          <p style={{ color: "red", fontStyle: "italic" }}>
             Expire dans 10mn
           </p>
          )}
      </div>
    </div>
  );
}

export default CommandeDetailModal;
