const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = require("../router/router");
const student = require("../model/client");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });


// on creer un app express minimale pour les tests sans lancer le vrai serveur sur un port
const app = express();
app.use(express.json());
app.use(router);

// utilisateur de base interne avant certains tests
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
        // on insere d'abrd un user en base
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
        // insere un user hasher avant chaque test de login
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

    it("devrait refuser un compte existant", async () => {
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

    it("devrait retourner l'id si l'email existe", async () => {
        const res = await request(app)
                    .post("/forgotPassword")
                    .send({email: utilisateurDeBase.email});
        expect(res.status).toBe(200);
        expect(res.body.id).toBeDefined();
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

describe("POST /ChangePass/:id", () => {
    it("devrait changer le mot de passe avec succees", async () => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(utilisateurDeBase.password, salt);
        const user = await student.create({...utilisateurDeBase, password: hashed});

        const res = await request(app)
            .post(`/ChangePass/${user._id}`)
            .send({passChange:"NouveauPass@1"});

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Mot de passe mis a jour");

        // verifier que le nouveau mot de passe est bien hasher en base
        const updated = await student.findById(user._id);
        const match = await bcrypt.compare("NouveauPass@1", updated.password);
        expect(match).toBe(true);
    });
});