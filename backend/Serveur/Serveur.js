require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 1203;
const mongoose = require("mongoose");
const router = require("../router/router");
const methodoverride = require("method-override");
const cors = require("cors");

const clientsRoute = require("../router/clients");
const produitsRoute = require("../router/produits");
const commandesRoute = require("../router/commandes");

// CORS restreint a l'URL du frontend definie en variable d'environnement
// En developpement local, FRONTEND_URL=http://localhost:5173

// Liste blanche des origines autorisees
// Permet d'accepter plusieurs domaines frontend simultanement
const originesAutorisees = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || originesAutorisees.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Non autorise par CORS"));
    }
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/clients", clientsRoute);
app.use("/produits", produitsRoute);
app.use("/commandes", commandesRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté !"))
  .catch((err) => {
    console.error("Erreur MongoDB:", err);
    process.exit(1);
  });

app.use(methodoverride("_method"));
app.use(router);

app.listen(port, () => {
  console.log(`Serveur démarré au port ${port} !`);
});