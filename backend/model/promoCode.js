const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  // Type de reduction : "pourcentage" (ex: 10%) ou "fixe" (ex: 2000 Ar)
  typeReduction: {
    type: String,
    enum: ["pourcentage", "fixe"],
    required: true,
  },
  valeur: {
    type: Number,
    required: true,
    min: 0,
  },
  actif: {
    type: Boolean,
    default: true,
  },
  dateExpiration: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);