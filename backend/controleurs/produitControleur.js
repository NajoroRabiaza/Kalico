const Produit = require("../model/produits");
const { cloudinary } = require("../services/cloudinaryService");

// Extrait le public_id Cloudinary depuis une URL
// Exemple : https://res.cloudinary.com/xxx/image/upload/v123/kalico/produits/abc.jpg
// Retourne : kalico/produits/abc
const extrairePublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // On saute "upload" et la version (v123...)
    const sansVersion = parts.slice(uploadIndex + 2).join("/");
    // On retire l'extension
    return sansVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recuperation des produits" });
  }
};

const getProduitsParCategorie = async (req, res) => {
  try {
    const produits = await Produit.find({ categorie: req.params.categorie })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recuperation par categorie" });
  }
};

const getMenuSpecial = async (req, res) => {
  try {
    const menus = await Produit.find({ menuSpecial: true }).sort({ createdAt: -1 }).lean();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recuperation du menu special" });
  }
};

// Echappement des caracteres speciaux regex pour eviter les injections ReDoS
// L'utilisateur ne peut pas passer de regex arbitraire via le champ de recherche
const echapperRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const rechercheProduits = async (req, res) => {
  try {
    const { nom, description, prix } = req.query;
    const query = {};

    if (nom) query.nom = { $regex: echapperRegex(nom), $options: "i" };
    if (description) query.description = { $regex: echapperRegex(description), $options: "i" };
    if (prix) query.prix = Number(prix);

    const produits = await Produit.find(query).lean();
    res.status(200).json(produits);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche" });
  }
};

const addProduit = async (req, res) => {
  try {
    const { nom, prix, quantite, description, categorie, menuSpecial } = req.body;

    // req.file.path contient l'URL publique Cloudinary
    // req.file.filename contient le public_id Cloudinary
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
    const deleted = await Produit.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    // Supprimer l'image sur Cloudinary apres suppression du produit en base
    // Evite d'accumuler des images orphelines sur le compte Cloudinary
    const publicId = extrairePublicId(deleted.img);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: "Produit supprime" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression produit" });
  }
};

const updateProduit = async (req, res) => {
  try {
    const { nom, prix, quantite, description, categorie, menuSpecial } = req.body;

    const updated = {
      nom,
      prix,
      quantite,
      description,
      categorie,
      menuSpecial: menuSpecial === "true" || menuSpecial === true,
    };

    // Si une nouvelle image est uploadee, on remplace l'ancienne sur Cloudinary
    if (req.file) {
      const ancienProduit = await Produit.findById(req.params.id).lean();
      if (ancienProduit) {
        const publicId = extrairePublicId(ancienProduit.img);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updated.img = req.file.path;
    }

    const produit = await Produit.findByIdAndUpdate(req.params.id, updated, { new: true });
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise a jour du produit" });
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
