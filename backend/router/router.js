const express = require("express");
const rateLimit = require("express-rate-limit");
const AllController = require('../collection/sign');
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

// Limiteur strict pour les routes d'authentification :
// 10 tentatives maximum par fenetre de 15 minutes par adresse IP.
// Bloque les attaques brute-force sur login, signup et forgotPassword.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Trop de tentatives. Veuillez réessayer dans 15 minutes.",
  },
});

router.get("/dataUser", verifyToken, verifyAdmin, AllController.dataUser);
router.post("/signup", authLimiter, AllController.signup);
router.post("/forgotPassword", authLimiter, AllController.forgotPassword);
router.post("/login", authLimiter, AllController.login);

// La route ChangePass utilise desormais le resetToken temporaire dans l'URL
// et non plus l'_id permanent de l'utilisateur
// Le token est verifie et supprime cote backend apres usage
router.post("/ChangePass/:resetToken", AllController.ChangePass);

module.exports = router;