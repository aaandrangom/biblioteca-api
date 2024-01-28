require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const librosRoutes = require("./routes/libros");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const pedidoRoutes = require("./routes/pedidos");
const librosPedidos = require("./routes/libros_pedidos");
const portadasRoutes = require("./routes/portadas");

app.use(express.json());

app.use("/api/libros", librosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/libros_pedidos", librosPedidos);

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aaandrangom:OV5BoAdLwbOQkqL5@cluster0.ndhfkej.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Connection to MongoDB failed", err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.use("/api/portadas", portadasRoutes);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
