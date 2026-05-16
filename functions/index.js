const functions  = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.database();

const app = express();

app.use(cors({
  origin: ["https://appif-ae840.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// endpoint
app.post("/crear-usuario", async (req, res) => {
  try {
    const data = req.body;
    await db.ref("users").push(data);
    res.status(200).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

app.get("/", (req, res) => {
  logger.info("Backend funcionando correctamente", { structuredData: true });
  res.send("Servidor backend funcionando correctamente");
});

exports.api = functions.https.onRequest(app);