const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  ajouterCommande,
  getCommandes,
  updateCommande,
  deleteCommandeById,
} = require("../controleurs/commandeControleur");

// Route proteger : seul un user connecte peut passer une commande
router.post("/", verifyToken, ajouterCommande);

// Routes proteger : seul un admin connecte peut consulter et gerer les commandes
router.get("/", verifyToken, getCommandes);
router.put("/:id", verifyToken, updateCommande);
router.delete("/:id", verifyToken, deleteCommandeById);

module.exports = router;