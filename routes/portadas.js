const express = require("express");
const axios = require("axios");
const Portada = require("../models/portada"); // Asegúrate de que la ruta al modelo Portada es correcta
const router = express.Router();

router.post("/guardar-portada", async (req, res) => {
  const titulo = req.body.titulo; // El título se recibe del cuerpo de la solicitud
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    titulo
  )}`;

  try {
    const response = await axios.get(url);
    const libros = response.data.docs;

    if (libros.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const primerLibro = libros[0];
    const seed = primerLibro.seed[0];
    const olid = seed.match(/\/books\/(OL\d+M)/)[1];
    const urlPortada = `http://covers.openlibrary.org/b/olid/${olid}-L.jpg`;

    // Crear una nueva portada en la base de datos
    const nuevaPortada = new Portada({ urlPortada });
    const portadaGuardada = await nuevaPortada.save();

    res.json({
      message: "Portada guardada con éxito",
      portada: portadaGuardada,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al guardar la portada", error: error.message });
  }
});

module.exports = router;
