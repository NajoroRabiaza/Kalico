const jwt = require("jsonwebtoken");

// Middleware qui verifie la presence et la validite du token JWT
// Il est placer entre la route et le controleur pour bloquer les requetes non autorises
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Le token est attendu au format : "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acces refuse : token manquant" });
  }

  try {
    // Verifier la signature et l'expiration du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On attache les donnees du user au request pour les controleurs suivants
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expire" });
  }
};

module.exports = verifyToken;