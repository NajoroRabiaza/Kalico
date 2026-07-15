const express = require("express");
const router = express.Router();
const { getClients } = require("../controleurs/clientControleur");
const verifyToken = require("../middleware/verifyToken");

// Route admin uniquement : un simple visiteur ne doit pas voir la liste des clients
router.get("/", verifyToken, getClients);

module.exports = router;