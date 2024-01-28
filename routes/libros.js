const express = require("express");
const router = express.Router();
const Libro = require("../models/libro");

router.get("/buscar-libro/:titulo", async (req, res) => {
  try {
    const titulo = req.params.titulo;
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      titulo
    )}`;

    const response = await axios.get(url);
    const libros = response.data.docs;

    if (libros.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const primerLibro = libros[0];
    const seed = primerLibro.seed[0];
    const olid = seed.match(/\/books\/(OL\d+M)/)[1];

    const urlPortada = `http://covers.openlibrary.org/b/olid/${olid}-L.jpg`;

    res.json({ urlPortada: urlPortada });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al buscar el libro", error: error.message });
  }
});

// Obtiene todos los libros alfabeticamente
router.get("/", async (req, res) => {
  try {
    const libros = await Libro.findAll({
      order: [["li_titulo", "ASC"]],
    });
    res.json(libros);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Crea un libro
router.post("/", async (req, res) => {
  try {
    const { li_titulo, li_autor, li_año_publicacion, li_stock, li_estado } =
      req.body;

    let libro = await Libro.create({
      li_titulo,
      li_autor,
      li_año_publicacion,
      li_stock,
      li_estado,
    });
    res.json(libro);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Actualiza la informacion de un libro por su id
router.put("/:id", async (req, res) => {
  try {
    const { li_titulo, li_autor, li_año_publicacion, li_stock, li_estado } =
      req.body;

    let resultado = await Libro.update(
      {
        li_titulo,
        li_autor,
        li_año_publicacion,
        li_stock,
        li_estado,
      },
      {
        where: { li_secuencial: req.params.id },
      }
    );

    if (resultado[0] > 0) {
      let libroActualizado = await Libro.findByPk(req.params.id);
      res.json(libroActualizado);
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Cambia el estado de un libro a 'D' por su id
router.delete("/:id", async (req, res) => {
  try {
    const resultado = await Libro.update(
      { estado: "D" }, // Establece el estado a 'D'
      { where: { li_secuencial: req.params.id } }
    );

    if (resultado[0] > 0) {
      res.json({ message: "Libro deshabilitado" });
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Busca un libro por su titulo
router.get("/titulo", async (req, res) => {
  try {
    const { titulo } = req.query;

    if (!titulo) {
      return res
        .status(400)
        .json({ message: "Por favor, proporciona un título para buscar." });
    }

    const libros = await Libro.findAll({
      where: {
        li_titulo: {
          [Sequelize.Op.iLike]: `%${titulo}%`,
        },
      },
    });

    res.json(libros);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Busca un o varios libros por su autor.
router.get("/autor", async (req, res) => {
  try {
    const { autor } = req.query;

    if (!autor) {
      return res
        .status(400)
        .json({ message: "Por favor, proporciona un autor para buscar." });
    }

    const libros = await Libro.findAll({
      where: {
        li_autor: {
          [Sequelize.Op.iLike]: `%${autor}%`,
        },
      },
      order: [["li_autor", "ASC"]],
    });

    res.json(libros);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

router.get("/publicacion", async (req, res) => {
  try {
    const { anio } = req.query;

    if (!anio) {
      return res.status(400).json({
        message: "Por favor, proporciona un año de publicación para buscar.",
      });
    }

    const libros = await Libro.findAll({
      where: {
        li_año_publicacion: anio,
      },
      order: [["li_titulo", "ASC"]],
    });

    res.json(libros);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

module.exports = router;
