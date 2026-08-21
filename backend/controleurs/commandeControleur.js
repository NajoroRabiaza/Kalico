const Commande = require("../model/commande");

const ajouterCommande = async (req, res) => {
  try {
    const { methodePaiement, niveau, numero } = req.body;
    if (methodePaiement === "Cash" && !niveau) {
      return res.status(400).json({ message: "Le niveau est requis pour un paiement Cash" });
    }
    if (methodePaiement === "Mvola" && !numero) {
      return res.status(400).json({ message: "Le numero est requis pour un paiement Mvola" });
    }
    const {clientNom, methodePaiement, niveau, numero, produits, total} = req.body;
    const nouvelleCommande = new Commande({
      clientNom, methodePaiement, niveau, numero, produits, total,
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

const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).lean();
    if (!commande) return res.status(404).json({ error: "Commande non trouvee" });
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
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
  getCommandeById,
  updateCommande,
  deleteCommandeById,
  nettoyerCommandesExpires,
};
