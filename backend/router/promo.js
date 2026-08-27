const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { validerPromo } = require("../controleurs/promoControleur");

// Route protegee : seul un user connecte peut valider un code promo
router.post("/validate", verifyToken, validerPromo);

module.exports = router;