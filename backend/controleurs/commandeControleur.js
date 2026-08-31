const Commande = require("../model/commande");

// Regex stricte : numéro Mvola commence par 034 ou 038, suivi de 7 chiffres
// Ancres ^ et $ garantissent qu'on valide toute la chaine, pas juste une sous-chaine
const MVOLA_REGEX = /^03[48]\d{7}$/;

const ajouterCommande = async (req, res) => {
  try {
    const { clientNom, methodePaiement, niveau, numero, produits, total } = req.body;

    // Validation de clientNom
    if (!clientNom || typeof clientNom !== "string" || !clientNom.trim()) {
      return res.status(400).json({ message: "Le nom du client est requis" });
    }

    // Validation de produits : doit etre un tableau non vide
    if (!Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ message: "La commande doit contenir au moins un produit" });
    }

    // Validation de total : doit etre un nombre strictement positif
    const totalNum = Number(total);
    if (isNaN(totalNum) || totalNum <= 0) {
      return res.status(400).json({ message: "Le total de la commande est invalide" });
    }

    // Validation selon la methode de paiement
    if (methodePaiement === "Cash" && !niveau) {
      return res.status(400).json({ message: "Le niveau est requis pour un paiement Cash" });
    }

    if (methodePaiement === "Mvola") {
      if (!numero) {
        return res.status(400).json({ message: "Le numero est requis pour un paiement Mvola" });
      }
      if (!MVOLA_REGEX.test(numero.trim())) {
        return res.status(400).json({ message: "Le numero Mvola est invalide (034XXXXXXX ou 038XXXXXXX)" });
      }
    }

    const nouvelleCommande = new Commande({
      clientNom: clientNom.trim(),
      methodePaiement,
      niveau,
      numero,
      produits,
      total: totalNum,
    });

    await nouvelleCommande.save();
    res.status(201).json(nouvelleCommande);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    res.status(500).json({ message: err.message });
  }
};

const nettoyerCommandesExpires = async () => {
  const maintenant = new Date();
  const limiteExpiration = new Date(maintenant.getTime() - 10 * 60 * 1000);
  const result = await Commande.deleteMany({
    methodePaiement: "Cash",
    date: { $lte: limiteExpiration },
  });
  if (result.deletedCount > 0) {
    console.log(`${result.deletedCount} commande(s) Cash expiree(s) supprimee(s)`);
  }
  return result.deletedCount;
};

const getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ date: -1 }).lean();
    res.status(200).json(commandes);
  } catch (err) {
    console.error("Erreur lors de la recuperation des commandes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateCommande = async (req, res) => {
  try {
    const { statut, archive } = req.body;
    const champsAutorises = {};
    if (statut !== undefined) champsAutorises.statut = statut;
    if (archive !== undefined) champsAutorises.archive = archive;
    const updated = await Commande.findByIdAndUpdate(
      req.params.id,
      champsAutorises,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Commande non trouvee" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCommandeById = async (req, res) => {
  try {
    const deleted = await Commande.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Commande non trouvee" });
    }
    res.status(200).json({ message: "Commande supprimee avec succes" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  ajouterCommande,
  getCommandes,
  updateCommande,
  deleteCommandeById,
  nettoyerCommandesExpires,
};