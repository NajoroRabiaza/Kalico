const Produit = require("../model/produits");
const { cloudinary } = require("../services/cloudinaryService");

const extrairePublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const sansVersion = parts.slice(uploadIndex + 2).join("/");
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
    const deleted = await Produit.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

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
};