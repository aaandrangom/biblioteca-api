require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./models/doc");
const cors = require("cors");
const app = express();

const librosRoutes = require("./routes/libros");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const pedidoRoutes = require("./routes/pedidos");
const librosPedidos = require("./routes/libros_pedidos");
const portadasRoutes = require("./routes/portadas");

app.use(cors());
app.use(express.json());

app.use("/api/libros", librosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/libros_pedidos", librosPedidos);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mongoDbUrl = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDbUrl);
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
