const student = require("../model/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    // On verifie si un compte existe deja avec ce nom ou cet email
    const existing = await student.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }]
    });

    if (existing) {
      return res.status(409).json({ message: "Compte deja existant" });
    }

    // Le salt definit le cout du hashage (10 = standard recommande en production)
    // Plus le nombre est eleve, plus le hash est lent a calculer, donc difficile a bruteforcer
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

    // bcrypt.compare compare le mot de passe en clair avec le hash stocke en base
    // Il est impossible de retrouver le mot de passe original a partir du hash
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
    const users = await student.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recuperation des utilisateurs" });
  }
};

const ChangePass = async (req, res) => {
  try {
    const getid = req.params.id;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.passChange, salt);

    await student.findByIdAndUpdate(getid, { $set: { password: hashedPassword } });
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
};
