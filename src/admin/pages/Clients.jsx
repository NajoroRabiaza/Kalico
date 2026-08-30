import API_URL from "../../api";
import authFetch from "../../utils/authFetch";
import { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';
import "../styles/clients.css";

const niveauStyles = {
  admin:  "badge badge--admin",
  vip:    "badge badge--vip",
  normal: "badge badge--normal",
  L2:     "badge badge--l2",
};

const columns = [
  { id: 'name', label: 'Nom', minWidth: 150 },
  {
    id: 'level',
    label: 'Niveau',
    minWidth: 100,
    render: (value) => (
      <span className={niveauStyles[value] || "badge badge--normal"}>
        {value}
      </span>
    ),
  },
  { id: 'createdAt', label: 'Date', minWidth: 150 },
];

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
    return { ...client, createdAt: `${datePart} à ${timePart}` };
  });
}

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = () => {
      authFetch(`${API_URL}/dataUser`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setClients(formatClients(data));
          } else {
            console.error('Format inattendu', data);
          }
        })
        .catch(err => console.error('Erreur fetch clients:', err));
    };

    fetchClients();
    const intervalId = setInterval(fetchClients, 60000);
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