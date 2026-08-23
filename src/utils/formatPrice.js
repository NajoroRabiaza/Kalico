/**
 * Formate un montant en ariary avec separateur de milliers.
 * Utilise l'API native Intl.NumberFormat — aucune dependance externe.
 * Le \u00a0 (espace insecable) entre le nombre et "Ar" empeche
 * un retour a la ligne entre les deux sur les ecrans etroits.
 *
 * Exemple : formatPrice(42000) => "42 000\u00a0Ar"
 */
export const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-FR").format(amount) + "\u00a0Ar";