const nodemailer = require("nodemailer");

// Transporteur SMTP Gmail
// Utilise un App Password Google et non le mot de passe du compte
// Pour generer un App Password : myaccount.google.com > Securite > Mots de passe des applications
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const envoyerEmailReinitialisation = async (destinataire, resetToken) => {
  const lienReinit = `${process.env.FRONTEND_URL}/ChangePassword/${resetToken}`;

  const mailOptions = {
    from: `"Kalico Restaurant" <${process.env.EMAIL_USER}>`,
    to: destinataire,
    subject: "Reinitialisation de votre mot de passe Kalico",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1c1c2e; margin-bottom: 1rem;">Reinitialisation du mot de passe</h2>
        <p style="color: #4b5563; margin-bottom: 1.5rem;">
          Vous avez demande a reinitialiser votre mot de passe Kalico.
          Cliquez sur le bouton ci-dessous pour continuer.
        </p>
        <a href="${lienReinit}" style="
          display: inline-block;
          background: linear-gradient(135deg, #e65d0d, #f59e0b);
          color: white;
          padding: 0.85rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        ">
          Reinitialiser mon mot de passe
        </a>
        <p style="color: #9ca3af; font-size: 0.85rem;">
          Ce lien expire dans <strong>15 minutes</strong> et ne peut etre utilise qu'une seule fois.
        </p>
        <p style="color: #9ca3af; font-size: 0.85rem;">
          Si vous n'avez pas demande cette reinitialisation, ignorez cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0;" />
        <p style="color: #9ca3af; font-size: 0.75rem; text-align: center;">
          Kalico Restaurant — Ne pas repondre a cet email
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { envoyerEmailReinitialisation };