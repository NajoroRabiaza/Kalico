import { formatPrice } from "../../utils/formatPrice";

export const columns = [
  { id: 'clientNom', label: 'Client', minWidth: 150 },
  { id: 'niveau', label: 'Niveau', minWidth: 100 },
  { id: 'numero', label: 'Numéro Mvola', minWidth: 130 },
  { id: 'methodePaiement', label: 'Paiement', minWidth: 100 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'statut', label: 'Statut', minWidth: 100 },
  { id: 'date', label: 'Date', minWidth: 150 },
  { id: 'produitsDisplay', label: 'Produits', minWidth: 300 },
];

export function formatCommandes(commandes) {
  return commandes.map(cmd => {
    const dateObj = new Date(cmd.date);
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
      ...cmd,
      niveau: cmd.methodePaiement === "Cash" ? (cmd.niveau || " - ") : " - ",
      numero: cmd.methodePaiement === "Mvola" ? (cmd.numero || " - ") : " - ",
      total: formatPrice(cmd.total),
      date: `${datePart} à ${timePart}`,
      produitsDisplay: Array.isArray(cmd.produits)
        ? cmd.produits.map(p => `${p.nom} x${p.quantity} (${p.prix} Ar)`).join(", ")
        : '',
    };
  });
}