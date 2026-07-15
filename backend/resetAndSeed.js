require("dotenv").config();
const mongoose = require("mongoose");
const Produit = require("./model/produits");
const Eleve = require("./model/client");
const Commande = require("./model/commande");

// ATTENTION : ce script supprime et reinsere toutes les donnees
// Ne jamais l'executer en production sans sauvegarde prealable
// Il utilise MONGO_URI du .env pour eviter de toucher accidentellement la mauvaise base
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI manquant dans .env, arret du script");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI);