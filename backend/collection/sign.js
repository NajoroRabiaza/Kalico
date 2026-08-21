const student = require("../model/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { envoyerEmailReinitialisation } = require("../services/emailService");

const signup = async (req, res) => {
  try {
    const existing = await student.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }]
    });

    if (existing) {
      return res.status(409).json({ message: "Compte deja existant" });
    }

    const niveauxAutorises = ["L1", "L2", "L3"];
    if (!niveauxAutorises.includes(req.body.level)) {
      return res.status(400).json({ message: "Niveau invalide : L1, L2 ou L3 uniquement" });
    }

    const { password } = req.body;
    const caracteresSpeciaux = ["@", "#", "$", "&", "*"];
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caracteres" });
    }
    if (!caracteresSpeciaux.some((c) => password.includes(c))) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins un caractere special : @ # $ & ou *" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const Client = new student({
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
      password: hashedPassword,
    });

    await Client.save();
    res.json({ message: "Compte cree avec succes !" });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la creation du compte" });
  }
};

const login = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const user = await student.findOne({ $or: [{ name }, { email }] });

    if (!user) {
      return res.status(404).json({ message: "Compte introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion reussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur de connexion" });
  }
};

const dataUser = async (req, res) => {
  try {
    const users = await student.find({}).select("-password -resetToken -resetTokenExpire");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recuperation des utilisateurs" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await student.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email introuvable" });
    }

    // Generation d'un token aleatoire cryptographiquement sur
    // Stocke en base avec expiration 15 minutes
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    await student.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpire,
    });

    // Envoi du token par email uniquement
    // Le token n'est jamais expose dans la reponse HTTP
    await envoyerEmailReinitialisation(user.email, resetToken);

    res.json({ message: "Un email de reinitialisation a ete envoye" });

  } catch (error) {
    console.error("Erreur forgotPassword:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ChangePass = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { passChange } = req.body;

    if (!passChange) {
      return res.status(400).json({ message: "Nouveau mot de passe requis" });
    }

    // Recherche par resetToken avec verification de l'expiration simultanement
    const user = await student.findOne({
      resetToken,
      resetTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expire" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passChange, salt);

    // Token supprimer apres usage : ne peut servir qu'une seule fois
    await student.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetToken: "", resetTokenExpire: "" },
    });

    res.json({ message: "Mot de passe mis a jour" });

  } catch (err) {
    res.status(500).json({ message: "Erreur lors du changement de mot de passe" });
  }
};

module.exports = {
  signup,
  login,
  dataUser,
  ChangePass,
  forgotPassword,
};