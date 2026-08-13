require("dotenv").config({path: require("path").resolve(__dirname, "../.env")});

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const commandesRoute = require("../router/commandes");
const Commande = require("../model/commande");

const app = express();
app.use(express.json());
app.use("/commandes", commandesRoute);

// genere un token valide pour les routes proteger par verifyToken
const genererToken = () => {
    return jwt.sign(
        {id: new mongoose.Types.ObjectId(), name: "TestUser", level: "L2"},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );
};

const commandeDeBase = {
    clientNom: "Jean Test",
    methodePaiement: "Cash",
    niveau: "L2",
    produits: [],
    total: 25000,
    date: new Date(),
    statut: "en attente",
};

describe("POST /commandes", () => {
    it("devrait creer une commande Cash avec succes", async () => {
        const token = genererToken();
        const res = await request(app)
            .post("/commandes")
            .set("Authorization", `Bearer ${token}`)
            .send(commandeDeBase);

        expect(res.status).toBe(201);
        expect(res.body.clientNom).toBe("Jean Test");
        expect(res.body.methodePaiement).toBe("Cash");
    });

    it("devrait refuser une commande Cash sans niveau", async () => {
        const token = genererToken();
        const res = await request(app)
            .post("/commandes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                ...commandeDeBase,
                methodePaiement: "Cash",
                niveau: undefined,
            });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Le niveau est requis pour un paiement Cash");
    });

    it("devrait creer une commande Mvola avec succes", async () => {
        const token = genererToken();
        const res = await request(app)
            .post("/commandes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                ...commandeDeBase,
                methodePaiement: "Mvola",
                niveau: undefined,
                numero: "0341234567",
            });
        expect(res.status).toBe(201);
        expect(res.body.methodePaiement).toBe("Mvola");
    });

    it("devrait refuser une commande Mvola sans numero", async () => {
        const token = genererToken();
        const res = await request(app)
            .post("/commandes")
            .set("Authorization", `Bearer ${token}`)
            .send({...commandeDeBase, methodePaiement: "Mvola", niveau: undefined});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Le numero est requis pour un paiement Mvola");
    });

    it("devrait retourner 401 sans token", async () => {
        const res = await request(app).post("/commandes").send(commandeDeBase);
        expect(res.status).toBe(401);
    });
});

describe("GET /commandes", () => {
    it("devrait retourner toutes les commandes", async () => {
        const token = genererToken();
        await Commande.create(commandeDeBase);
        await Commande.create({...commandeDeBase, clientNom: "Marie Test"});

        const res = await request(app)
            .get("/commandes")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
    });

    it("devrait retourner 401 sans token", async () => {
        const res = await request(app).get("/commandes");
        expect(res.status).toBe(401);
    });
});

describe("PUT /commandes/:id", () => {
    it("devrait mettre a jour le statut d'une commande", async () => {
        const token = genererToken();
        const commande = await Commande.create(commandeDeBase);

        const res = await request(app)
            .put(`/commandes/${commande._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({statut: "en cours"});

        expect(res.status).toBe(200);
        expect(res.body.statut).toBe("en cours");
    });

    it("devrait retourner 404 si la commande n'existe pas", async () => {
        const token = genererToken();
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/commandes/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({statut: "en cours"});
        expect(res.status).toBe(404);
    });
});

describe("DELETE /commandes/:id", () => {
    it("devrait supprimer une commande existante", async () => {
        const token = genererToken();
        const commande = await Commande.create(commandeDeBase);

        const res = await request(app)
            .delete(`/commandes/${commande._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Commande supprimee avec succes");

        const deleted = await Commande.findById(commande._id);
        expect(deleted).toBeNull();
    });

    it("devrait retourner 404 si la commande n'existe pas", async () => {
        const token = genererToken();
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/commandes/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Commande non trouvee");
    });
});