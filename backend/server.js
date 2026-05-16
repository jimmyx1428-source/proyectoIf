const express = require("express");
const cors = require("cors");

const { db, auth } = require("./utils/firebase");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {

    const snapshot = await db.ref("users").once("value");

    res.json(snapshot.val());

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

//Endpoint listar usuarios
app.get("/usuarios", async (req, res) => {
  try {

    const snapshot = await db.ref("users").once("value");
    res.json(snapshot.val());

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//Endpoint eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {

  try {
    const { id } = req.params;
    await db.ref(`users/${id}`).remove();
    res.json({
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message,});
  }
});

//Endpoint editar usuario
app.put("/usuarios/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const datos = req.body;
    await db.ref(`users/${id}`).update(datos);
    res.json({
      message: "Usuario actualizado correctamente",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//Endpoint para la configuracion
app.get("/configuracion", async (req, res) => {

  try {
    const snapshot = await db.ref("configuracion").once("value");
    res.json(snapshot.val());

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.put("/configuracion", async (req, res) => {

    try {

      const datos = req.body;

      await db.ref("configuracion").update(datos);

      res.json({
        message: "Configuración actualizada correctamente",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  });
//get de usuario por ID
app.get("/usuarios/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const snapshot = await db.ref(`users/${id}`).once("value");
    if (!snapshot.exists()) {

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//Lista de sensores
app.get("/sensores", async (req, res) => {

  try {
    const snapshot = await db.ref("sensores").once("value");
    res.json(snapshot.val());
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
// Ruta para crear usuarios
app.post("/crear-usuario", async (req, res) => {
  try {
    const { email, password, nombre, telefono, tipo } = req.body;

    if (!email || !password || !nombre || !telefono || !tipo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: nombre,
    });

    // Guardar info adicional en Realtime Database
    await db.ref("users/" + userRecord.uid).set({
      uid: userRecord.uid,
      email,
      nombre,
      telefono,
      tipo,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Usuario creado con éxito", uid: userRecord.uid });

  } catch (error) {
    console.error("Error al crear usuario:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    res.status(500).json({ message: error.message || "Error interno del servidor" });
  }
});


app.listen(3000, () => {
  console.log("Servidor iniciado");
});

