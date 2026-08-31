const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utilisateur = new Schema({
  name: {
    type: String,
    required: true,
    // Index sur name : le signup fait findOne({ $or: [{ name }, { email }] })
    // Sans cet index, chaque inscription est un full collection scan sur name.
    // email a deja un index implicite via unique: true.
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  // Token temporaire pour la reinitialisation du mot de passe
  // Genere par forgotPassword, consomme et supprime par ChangePass
  // Ne peut etre utilise qu'une seule fois et expire apres 15 minutes
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpire: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const student = mongoose.model("eleve", utilisateur);
module.exports = student;