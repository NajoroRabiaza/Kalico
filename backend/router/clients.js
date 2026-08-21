const express = require("express");
const router = express.Router();
const { getClients } = require("../controleurs/clientControleur");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
// Route admin uniquement : un simple visiteur ne doit pas voir la liste des clients
router.get("/", verifyToken, verifyAdmin, getClients);

module.exports = router;