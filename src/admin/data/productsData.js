import { formatPrice } from "../../utils/formatPrice";

// Convertit une chaine en Title Case :
// "SOUPE CHINOISE" -> "Soupe Chinoise", "riz special" -> "Riz Special"
function toTitleCase(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((mot) => mot.charAt(0).toUpperCase() + mot.slice(1))
    .join(' ');
}

export const productsColumns = [
  {
    id: 'nom',
    label: 'Nom',
    minWidth: 150,
    render: (value) => toTitleCase(value),
  },
  {
    id: 'prix',
    label: 'Prix',
    minWidth: 100,
    format: (value) => formatPrice(value),
  },
  { id: 'quantite', label: 'Quantité', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 200 },
];