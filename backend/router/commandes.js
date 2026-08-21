const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  ajouterCommande,
  getCommandes,
  updateCommande,
  deleteCommandeById,
} = require("../controleurs/commandeControleur");

// Route proteger : seul un user connecte peut passer une commande
router.post("/", verifyToken, ajouterCommande);

// Routes proteger : seul un admin connecte peut consulter et gerer les commandes
router.get("/", verifyToken, verifyAdmin, getCommandes);
router.put("/:id", verifyToken, verifyAdmin, updateCommande);
router.delete("/:id", verifyToken, verifyAdmin, deleteCommandeById);

module.exports = router;