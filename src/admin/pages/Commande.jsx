import API_URL from "../../api";
import authFetch from "../../utils/authFetch";
import { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';
import { columns, formatCommandes } from '../data/commandesData';

export default function Commande() {
  const [commandes, setCommandes] = useState([]);

  const fetchCommandes = () => {
    // authFetch injecte le token : route protegee par verifyToken
    authFetch(`${API_URL}/commandes`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCommandes(formatCommandes(data));
        } else {
          console.error("Données invalides reçues:", data);
          setCommandes([]);
        }
      })
      .catch(err => console.error('Erreur fetch commandes:', err));
  };

  useEffect(() => {
    fetchCommandes();
    const intervalId = setInterval(fetchCommandes, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteCommande = (id) => {
    // authFetch injecte le token : route protegee par verifyToken
    authFetch(`${API_URL}/commandes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de suppression");
        fetchCommandes();
      })
      .catch((err) => console.error("Erreur suppression commande :", err));
  };

  const handleStatutChange = (commandeId, newStatut) => {
    // authFetch injecte le token : route protegee par verifyToken
    authFetch(`${API_URL}/commandes/${commandeId}`, {
      method: 'PUT',
      body: JSON.stringify({ statut: newStatut }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur mise à jour statut');
        fetchCommandes();
      })
      .catch(err => console.error('Erreur maj statut:', err));
  };

  const columnsWithDropdown = columns.map((col) => {
    if (col.id === 'statut') {
      return {
        ...col,
        render: (value, row) => (
          <select
            value={value}
            onChange={(e) => handleStatutChange(row._id, e.target.value)}
          >
            <option value="en attente">en attente</option>
            <option value="en cours">en cours</option>
            <option value="prêt">prêt</option>
          </select>
        ),
      };
    }
    return col;
  });

  return (
    <CustomTable
      columns={columnsWithDropdown}
      rows={commandes}
      uniqueKey="_id"
      onDelete={handleDeleteCommande}
    />
  );
}
