require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const student = require("../model/client");

// Script de migration a executer UNE SEULE FOIS
// Il detecte les mots de passe en clair (non hashe) et les remplace par leur hash bcrypt
// Un hash bcrypt commence toujours par "$2a$" ou "$2b$", ce qui permet de les identifier

const migratePasswords = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connecte");

  const users = await student.find({});
  let migrated = 0;

  for (const user of users) {
    const alreadyHashed =
      user.password.startsWith("$2a$") || user.password.startsWith("$2b$");

    if (!alreadyHashed) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(user.password, salt);
      await student.findByIdAndUpdate(user._id, { $set: { password: hashed } });
      console.log(`Migre : ${user.name}`);
      migrated++;
    }
  }

  console.log(`Migration terminee : ${migrated} compte(s) mis a jour`);
  await mongoose.disconnect();
};

migratePasswords().catch((err) => {
  console.error("Erreur migration :", err);
  process.exit(1);
});
