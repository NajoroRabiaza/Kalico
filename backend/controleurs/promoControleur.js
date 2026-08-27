const PromoCode = require("../model/promoCode");

const validerPromo = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Code promo manquant." });
    }

    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });

    if (!promo) {
      return res.status(404).json({ message: "Code promo invalide." });
    }

    if (!promo.actif) {
      return res.status(400).json({ message: "Ce code promo n'est plus actif." });
    }

    if (new Date() > new Date(promo.dateExpiration)) {
      return res.status(400).json({ message: "Ce code promo a expiré." });
    }

    return res.status(200).json({
      message: "Code promo valide.",
      typeReduction: promo.typeReduction,
      valeur: promo.valeur,
    });
  } catch (err) {
    console.error("Erreur validation promo :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { validerPromo };