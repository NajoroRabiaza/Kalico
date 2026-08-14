const student = require("../model/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const signup = async (req, res) => {
  try {
    const existing = await student.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }]
    });

    if (existing) {
      return res.status(409).json({ message: "Compte deja existant" });
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
    res.json({ message: "Compte creer avec succes !" });

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

    // Generation d'un token aleatoire cryptographiquement sur avec crypto.randomBytes
    // Ce token est stocke en base avec une expiration de 15 minutes
    // Il remplace l'exposition de l'_id permanent dans l'URL
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    await student.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpire,
    });

    res.json({ resetToken });

  } catch (error) {
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

    // Recherche de l'utilisateur par son resetToken
    // On verifie simultanement que le token existe et qu'il n'est pas expire
    const user = await student.findOne({
      resetToken,
      resetTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expire" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passChange, salt);

    // Le token est supprime apres usage : il ne peut servir qu'une seule fois
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