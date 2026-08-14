const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = require("../router/router");
const student = require("../model/client");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
app.use(router);

const utilisateurDeBase = {
    name: "TestUser",
    email: "testuser@gmail.com",
    password: "TestPass@1",
    level: "L2",
};

describe("POST /signup", () => {
    it("devrait creer un nouveau compte avec succees", async () => {
        const res = await request(app)
                                .post("/signup")
                                .send(utilisateurDeBase);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Compte cree avec succes !");
    });

    it("devrait refuser un compte avec le meme email", async () => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(utilisateurDeBase.password, salt);
        await student.create({...utilisateurDeBase, password: hashed});

        const res = await request(app).post("/signup").send(utilisateurDeBase);
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Compte deja existant");
    });
});

describe("POST /login", () => {
    beforeEach(async () => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(utilisateurDeBase.password, salt);
        await student.create({...utilisateurDeBase, password: hashed});
    });

    it("devrait retourner un token JWT avec les bonnes credentials", async () => {
        const res = await request(app).post("/login").send({
            name: utilisateurDeBase.name,
            email: utilisateurDeBase.email,
            password: utilisateurDeBase.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.level).toBe("L2");
    });

    it("devrait refuser un mot de passe incorrect", async () => {
        const res = await request(app).post("/login").send({
            name: utilisateurDeBase.name,
            email: utilisateurDeBase.email,
            password: "MauvaisMotDePasse@1",
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Mot de passe incorrect");
    });

    it("devrait refuser un compte inexistant", async () => {
        const res = await request(app).post("/login").send({
            name: "Inconnu",
            email: "inconnu@gmail.com",
            password: "TestPass@1",
        });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Compte introuvable");
    });
});

describe("POST /forgotPassword", () => {
    beforeEach(async () => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(utilisateurDeBase.password, salt);
        await student.create({...utilisateurDeBase, password: hashed});
    });

    it("devrait retourner un resetToken si l'email existe", async () => {
        const res = await request(app)
                    .post("/forgotPassword")
                    .send({email: utilisateurDeBase.email});
        expect(res.status).toBe(200);
        // La nouvelle API retourne un resetToken temporaire, plus l'_id permanent
        expect(res.body.resetToken).toBeDefined();
    });

    it("devrait retourner 404 si l'email n'existe pas", async () => {
        const res = await request(app)
            .post("/forgotPassword")
            .send({email: "inexistant@gmail.com"});
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Email introuvable");
    });

    it("devrait retourner 400 si l'email est absent", async () => {
        const res = await request(app).post("/forgotPassword").send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email requis");
    });
});

describe("POST /ChangePass/:resetToken", () => {
    it("devrait changer le mot de passe avec un resetToken valide", async () => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(utilisateurDeBase.password, salt);
        await student.create({...utilisateurDeBase, password: hashed});

        // On obtient le resetToken via forgotPassword
        const forgotRes = await request(app)
            .post("/forgotPassword")
            .send({email: utilisateurDeBase.email});
        expect(forgotRes.status).toBe(200);
        const { resetToken } = forgotRes.body;

        // On change le mot de passe avec ce token
        const res = await request(app)
            .post(`/ChangePass/${resetToken}`)
            .send({passChange: "NouveauPass@1"});

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Mot de passe mis a jour");

        // Verifier que le nouveau mot de passe est bien hashe en base
        const user = await student.findOne({email: utilisateurDeBase.email});
        const match = await bcrypt.compare("NouveauPass@1", user.password);
        expect(match).toBe(true);

        // Verifier que le resetToken a bien ete supprimer apres usage
        expect(user.resetToken).toBeNull();
        expect(user.resetTokenExpire).toBeNull();
    });

    it("devrait refuser un resetToken invalide", async () => {
        const res = await request(app)
            .post("/ChangePass/token-invalide-inexistant")
            .send({passChange: "NouveauPass@1"});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Token invalide ou expire");
    });
});