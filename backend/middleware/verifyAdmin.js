const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.level !== "admin") {
    return res.status(403).json({ message: "Accès reserver aux administrateur." });
  }
  next();
};

module.exports = verifyAdmin;