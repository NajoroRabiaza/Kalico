import API_URL from "../../api";
import { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';

const columns = [
  { id: 'name', label: 'Nom', minWidth: 150 },
  { id: 'level', label: 'Niveau', minWidth: 100 },
  { id: 'createdAt', label: 'Date', minWidth: 150 },
];

// Fonction pour formater les dates
function formatClients(clients) {
  return clients.map(client => {
    const dateObj = new Date(client.createdAt);
    const datePart = dateObj.toLocaleDateString('fr-FR', {
      timeZone: 'Indian/Antananarivo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timePart = dateObj.toLocaleTimeString('fr-FR', {
      timeZone: 'Indian/Antananarivo',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      ...client,
      createdAt: `${datePart} à ${timePart}`,
    };
  });
}

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = () => {
      fetch('${API_URL}/dataUser')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formatted = formatClients(data);
            setClients(formatted);
          } else {
            console.error('Format inattendu', data);
          }
        })
        .catch(err => console.error('Erreur fetch clients:', err));
    };
  
    fetchClients(); // appel initial
  
    const intervalId = setInterval(() => {
      fetchClients();
    }, 10000); // toutes les 10 secondes
  
    return () => clearInterval(intervalId);
  }, []);  

  return (
    <CustomTable
      columns={columns}
      rows={clients}
      uniqueKey="_id"
    />
  );
}
