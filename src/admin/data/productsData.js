import { formatPrice } from "../../utils/formatPrice";

export const productsColumns = [
  { id: 'nom', label: 'Nom', minWidth: 150 },
  {
    id: 'prix',
    label: 'Prix',
    minWidth: 100,
    format: (value) => formatPrice(value),
  },
  { id: 'quantite', label: 'Quantité', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 200 },
];