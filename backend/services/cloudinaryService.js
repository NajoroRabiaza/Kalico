const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuration Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage Cloudinary pour multer
// Les images sont uploadees directement chez Cloudinary sans passer par le disque local
// Cloudinary retourne une URL publique stable qui ne disparait pas au redéploiement
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kalico/produits",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
