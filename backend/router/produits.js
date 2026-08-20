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
} = require("../controleurs/produitControleur");

// Routes publiques : tout visiteur peut consulter le menu
router.get("/", getProduits);
router.get("/categorie/:categorie", getProduitsParCategorie);
router.get("/menuSpecial", getMenuSpecial);

// Routes protegees : seul un admin connecte peut modifier le catalogue
router.post("/", verifyToken, upload.single("img"), addProduit);
router.put("/:id", verifyToken, upload.single("img"), updateProduit);
router.delete("/:id", verifyToken, deleteProduit);

module.exports = router;