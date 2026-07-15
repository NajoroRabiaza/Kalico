const express = require("express");
const AllController = require('../collection/sign');
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Route proteger : seul un user avec un token valide peut acceder aux donnees users
router.get("/dataUser", verifyToken, AllController.dataUser);
router.post("/signup", AllController.signup);
router.post("/forgotPassword", AllController.forgotPassword);
router.post("/login", AllController.login);
router.post("/ChangePass/:id", AllController.ChangePass);

module.exports = router;