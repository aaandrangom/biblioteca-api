const express = require("express");
const axios = require("axios");
const Portada = require("../models/portada");
const verificarToken = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/portadas/guardar-portada:
 *   post:
 *     summary: Guardar una portada de libro en la base de datos.
 *     description: Busca la portada de un libro por su título en Open Library y la guarda en la base de datos local.
 *     tags:
 *       - Portadas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del libro para el cual se busca la portada.
 *             required:
 *               - titulo
 *     responses:
 *       200:
 *         description: Portada de libro guardada con éxito en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 portada:
 *                   type: object
 *                   description: Información de la portada guardada en la base de datos.
 *       404:
 *         description: Libro no encontrado en Open Library.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       500:
 *         description: Error interno del servidor al guardar la portada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 */
router.post("/guardar-portada", verificarToken, async (req, res) => {
  const { titulo } = req.body; // Asegúrate de que "titulo" se envía en el cuerpo de la solicitud

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

    const nuevaPortada = new Portada({
      titulo,
      portadaUrl: urlPortada,
    });

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

router.get("/obtener-portada", async (req, res) => {
  const { titulo } = req.query; // Usamos req.query para obtener el título de los parámetros de la URL

  if (!titulo) {
    return res
      .status(400)
      .json({ message: "Por favor proporciona el título del libro." });
  }

  try {
    const portada = await Portada.findOne({ titulo: new RegExp(titulo, "i") });

    if (!portada) {
      return res.status(404).json({
        message: "Portada no encontrada para el título proporcionado.",
      });
    }

    res.json({
      message: "Portada encontrada con éxito",
      portada: portada,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al buscar la portada", error: error.message });
  }
});

module.exports = router;
