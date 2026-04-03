import API_URL from "../../api";
import { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';
import { columns, formatCommandes } from '../data/commandesData';

export default function Commande() {
  const [commandes, setCommandes] = useState([]);

  const fetchCommandes = () => {
    fetch('${API_URL}/commandes')
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
    fetchCommandes(); // appel initial du fetch
  
    const intervalId = setInterval(() => {
      fetchCommandes();
    }, 10000); // toutes les 10 secondes
  
    return () => clearInterval(intervalId); // nettoyage à la destruction du composant
  }, []);
  

  const handleDeleteCommande = (id) => {
    fetch(`${API_URL}/commandes/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de suppression");
        fetchCommandes();
      })
      .catch((err) => {
        console.error("Erreur suppression commande :", err);
        alert("Échec de la suppression");
      });
  };

  const handleStatutChange = (commandeId, newStatut) => {
    fetch(`${API_URL}/commandes/${commandeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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