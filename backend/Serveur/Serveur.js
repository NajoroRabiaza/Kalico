require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 1203;
const mongoose = require("mongoose");
const router = require("../router/router");
const methodoverride = require("method-override");
const cors = require("cors");
const cron = require("node-cron");
const { nettoyerCommandesExpires } = require("../controleurs/commandeControleur");

const clientsRoute = require("../router/clients");
const produitsRoute = require("../router/produits");
const commandesRoute = require("../router/commandes");

// Liste blanche des origines autorisees
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

// methodoverride doit etre declare avant le montage des routes
app.use(methodoverride("_method"));

// Le dossier uploads/ local n'est plus utilise
// Les images sont desormais stockees sur Cloudinary
// app.use("/uploads", express.static("uploads")); — supprime

app.use("/clients", clientsRoute);
app.use("/produits", produitsRoute);
app.use("/commandes", commandesRoute);
app.use(router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecte !");

    cron.schedule("*/5 * * * *", async () => {
      try {
        const count = await nettoyerCommandesExpires();
        if (count > 0) {
          console.log(`[CRON] ${count} commande(s) Cash expiree(s) supprimee(s)`);
        }
      } catch (err) {
        console.error("[CRON] Erreur nettoyage commandes:", err);
      }
    });

    app.listen(port, () => {
      console.log(`Serveur demarre au port ${port} !`);
    });
  })
  .catch((err) => {
    console.error("Erreur MongoDB:", err);
    process.exit(1);
  });
