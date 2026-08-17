const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { upload } = require("../services/cloudinaryService");
const {
  getProduits,
  addProduit,
  deleteProduit,
  updateProduit,
  getProduitsParCategorie,
  getMenuSpecial,
  rechercheProduits,
} = require("../controleurs/produitControleur");

// Routes publiques : tout visiteur peut consulter le menu
router.get("/", getProduits);
router.get("/categorie/:categorie", getProduitsParCategorie);
router.get("/menuSpecial", getMenuSpecial);
router.get("/searchProducts", rechercheProduits);

// Routes protegees : seul un admin connecte peut modifier le catalogue
// upload.single("img") envoie directement l'image chez Cloudinary
// req.file.path contient l'URL publique Cloudinary au lieu d'un chemin local
router.post("/", verifyToken, upload.single("img"), addProduit);
router.put("/:id", verifyToken, upload.single("img"), updateProduit);
router.delete("/:id", verifyToken, deleteProduit);

module.exports = router;
