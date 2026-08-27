require("dotenv").config();
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
const promoRoute = require("../router/promo");

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

const isMultipart = (req) =>
  (req.headers["content-type"] || "").startsWith("multipart/form-data");

app.use((req, res, next) => {
  if (isMultipart(req)) return next();
  express.json({ limit: "10mb" })(req, res, next);
});

app.use((req, res, next) => {
  if (isMultipart(req)) return next();
  express.urlencoded({ extended: true, limit: "10mb" })(req, res, next);
});

app.use(methodoverride("_method"));

app.use("/clients", clientsRoute);
app.use("/produits", produitsRoute);
app.use("/commandes", commandesRoute);
app.use("/promo", promoRoute);
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