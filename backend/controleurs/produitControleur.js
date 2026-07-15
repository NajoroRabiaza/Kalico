const Produit = require("../model/produits");

const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find().sort({ createdAt: -1 });
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits" });
  }
};

const getProduitsParCategorie = async (req, res) => {
  try {
    const produits = await Produit.find({ categorie: req.params.categorie }).sort({ createdAt: -1 });
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération par catégorie" });
  }
};

const getMenuSpecial = async (req, res) => {
  try {
    const menus = await Produit.find({ menuSpecial: true }).sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du menu spécial" });
  }
};

const rechercheProduits = async (req, res) => {
  try {
    const { nom, description, prix } = req.query;
    const query = {};

    if (nom) query.nom = { $regex: nom, $options: "i" };
    if (description) query.description = { $regex: description, $options: "i" };
    if (prix) query.prix = Number(prix);

    const produits = await Produit.find(query);
    res.status(200).json(produits);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche" });
  }
};

const addProduit = async (req, res) => {
  try {
    const { nom, prix, quantite, description, categorie, menuSpecial } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const nouveauProduit = new Produit({
      nom,
      prix,
      quantite,
      description,
      img: imagePath,
      categorie,
      menuSpecial: menuSpecial === "true" || menuSpecial === true,
    });

    await nouveauProduit.save();
    res.status(201).json(nouveauProduit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du produit" });
  }
};

const deleteProduit = async (req, res) => {
  try {
    // On verifie que le produit existe avant de repondre 200
    // findByIdAndDelete retourne null si l'id n'existe pas en base
    const deleted = await Produit.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.status(200).json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression produit" });
  }
};

const updateProduit = async (req, res) => {
  try {
    const { nom, prix, quantite, description, categorie, menuSpecial } = req.body;
    const imagePath = req.file ? req.file.path : undefined;

    const updated = {
      nom,
      prix,
      quantite,
      description,
      categorie,
      menuSpecial: menuSpecial === "true" || menuSpecial === true,
    };

    if (imagePath) updated.img = imagePath;

    const produit = await Produit.findByIdAndUpdate(req.params.id, updated, { new: true });
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du produit" });
  }
};

module.exports = {
  getProduits,
  addProduit,
  deleteProduit,
  updateProduit,
  getProduitsParCategorie,
  getMenuSpecial,
  rechercheProduits,
};