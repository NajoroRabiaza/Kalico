require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const path = require("path");
const { cloudinary } = require("../services/cloudinaryService");
const Produit = require("../model/produits");

const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

const migrer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connecte");

  const produits = await Produit.find({
    img: { $regex: "^uploads/" },
  });

  console.log(`${produits.length} produit(s) a migrer`);

  for (const produit of produits) {
    const nomFichier = produit.img.replace("uploads/", "");
    const cheminLocal = path.join(UPLOADS_DIR, nomFichier);

    try {
      const result = await cloudinary.uploader.upload(cheminLocal, {
        folder: "kalico/produits",
        use_filename: true,
        unique_filename: false,
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      });

      await Produit.findByIdAndUpdate(produit._id, { img: result.secure_url });
      console.log(`OK: ${produit.nom} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`ERREUR: ${produit.nom} (${cheminLocal}) ->`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("Migration terminee");
};

migrer();
