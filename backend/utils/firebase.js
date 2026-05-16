const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const auth = admin.auth();

module.exports = { db, auth };