const express = require("express");
const multer = require("multer");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getProduits,
  addProduit,
  deleteProduit,
  updateProduit,
  getProduitsParCategorie,
  getMenuSpecial,
  rechercheProduits,
} = require("../controleurs/produitControleur");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes publiques : tout visiteur peut consulter le menu
router.get("/", getProduits);
router.get("/categorie/:categorie", getProduitsParCategorie);
router.get("/menuSpecial", getMenuSpecial);
router.get("/searchProducts", rechercheProduits);

// Routes protegees : seul un admin connecte peut modifier le catalogue
router.post("/", verifyToken, upload.single("img"), addProduit);
router.put("/:id", verifyToken, upload.single("img"), updateProduit);
router.delete("/:id", verifyToken, deleteProduit);

module.exports = router;