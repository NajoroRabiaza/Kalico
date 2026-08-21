const express = require("express");
const AllController = require('../collection/sign');
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

router.get("/dataUser", verifyToken, verifyAdmin, AllController.dataUser);
router.post("/signup", AllController.signup);
router.post("/forgotPassword", AllController.forgotPassword);
router.post("/login", AllController.login);

// La route ChangePass utilise desormais le resetToken temporaire dans l'URL
// et non plus l'_id permanent de l'utilisateur
// Le token est verifie et supprime cote backend apres usage
router.post("/ChangePass/:resetToken", AllController.ChangePass);

module.exports = router;