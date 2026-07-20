const mongoose = require("mongoose");

// URL de la bdd locale reserver aux tests
// completement separer de la base atlas de prod
const TEST_DB_URL = "mongodb://127.0.0.1:27017/kalico_test";

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URL);
});

afterEach(async () => {
    // nettoie toutes les collections apres chaque test
    // pour garantir que chaque test part d'un etat vide
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});