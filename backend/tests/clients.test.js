require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const clientsRoute = require("../router/clients");
const Client = require("../model/client");

const app = express();
app.use(express.json());
app.use("/clients", clientsRoute);

// Token admin — route GET /clients exige verifyToken + verifyAdmin
const genererTokenAdmin = () => {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId(), name: "AdminTest", level: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Token utilisateur standard — ne passe pas verifyAdmin
const genererTokenUser = () => {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId(), name: "UserTest", level: "L2" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Cree un client en base directement via le modele pour les tests
const creerClientTest = async (overrides = {}) => {
  const hashedPassword = await bcrypt.hash("MotDePasse@123", 10);
  return Client.create({
    name: overrides.name || "ClientTest",
    email: overrides.email || "client@test.mg",
    level: overrides.level || "L2",
    password: hashedPassword,
  });
};

describe("GET /clients", () => {
  it("devrait retourner la liste des clients pour un admin", async () => {
    const token = genererTokenAdmin();
    await creerClientTest({ name: "Alice", email: "alice@test.mg" });
    await creerClientTest({ name: "Bob", email: "bob@test.mg" });

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("ne doit pas exposer le mot de passe dans la reponse", async () => {
    const token = genererTokenAdmin();
    await creerClientTest({ name: "Charlie", email: "charlie@test.mg" });

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Le select("-password") dans getClients doit exclure le champ password
    res.body.forEach((client) => {
      expect(client.password).toBeUndefined();
    });
  });

  it("devrait retourner 403 pour un utilisateur non admin", async () => {
    const token = genererTokenUser();

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("devrait retourner 401 sans token", async () => {
    const res = await request(app).get("/clients");
    expect(res.status).toBe(401);
  });

  it("devrait retourner un tableau vide si aucun client en base", async () => {
    const token = genererTokenAdmin();

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
