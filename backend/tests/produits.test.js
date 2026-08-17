require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const produitsRoute = require("../router/produits");
const student = require("../model/client");
const Produit = require("../model/produits");

const app = express();
app.use(express.json());
app.use("/produits", produitsRoute);

// genere un token admin valide pour les routes proteger
// sans ce token, tout les requetes POST/PUT/DELETE retournent 401
const genererTokenAdmin = () => {
    return jwt.sign(
        {id: new mongoose.Types.ObjectId(), name:"admin", level:"admin"},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    );
};

const produitDeBase = {
    nom: "Test Burger",
    prix: 15000,
    quantite: 10,
    description:"Un burger de test",
    categorie:"burger",
    menuSpecial: false,
};

describe("GET /produits", () => {
    it("devrait retourner une liste vide si aucun produit", async () => {
        const res = await request(app).get("/produits");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it("devrait retourner les produits existants", async () => {
        await Produit.create(produitDeBase);
        const res = await request(app).get("/produits");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].nom).toBe("Test Burger");
    });
});

describe("GET /produits/categorie/:categorie", () => {
    it("devrait retourner les produits de la categorie burger", async () => {
        await Produit.create(produitDeBase);
        await Produit.create({...produitDeBase, nom:"Riz Special", categorie:"riz"});
        
        const res = await request(app).get("/produits/categorie/burger");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].categorie).toBe("burger");
    });
});

describe("GET /produits/menuSpecial", () => {
    it("devrait retourner uniquement les produits du menu special", async () => {
        await Produit.create({...produitDeBase, menuSpecial:true});
        await Produit.create({...produitDeBase, nom:"Produit Normal", menuSpecial: false});

        const res = await request(app).get("/produits/menuSpecial");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].menuSpecial).toBe(true);
    });
});

describe("DELETE /produits/:id", () => {
    it("devrait supprimer un produit existant", async () => {
        const token = genererTokenAdmin();
        const produit = await Produit.create(produitDeBase);

        const res = await request(app)
            .delete(`/produits/${produit._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Produit supprime");

        // verifier que le produit n'existe plus en base
        const deleted = await Produit.findById(produit._id);
        expect(deleted).toBeNull();
    });

    it("devrait retourenr 404 si le produit n'existe pas", async () => {
        const token = genererTokenAdmin();
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/produits/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Produit introuvable");
    });

    it("devrait retourner 401 sans token", async () => {
        const produit = await Produit.create(produitDeBase);
        const res = await request(app).delete(`/produits/${produit._id}`);
        expect(res.status).toBe(401);
    });
});

describe("GET /produits/searchProducts", () => {
    it("devrait retourner les produits correspondant a la recherche par nom", async () => {
        await Produit.create(produitDeBase);
        await Produit.create({...produitDeBase, nom: "Soupe Chinoise", categorie:"soupe"});

        const res = await request(app).get("/produits/searchProducts?nom=burger");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].nom).toBe("Test Burger");
    });
});