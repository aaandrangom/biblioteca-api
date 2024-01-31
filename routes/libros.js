const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Libro = require("../models/libro");
const verificarToken = require("../middleware/authMiddleware");
const LibroPedido = require("../models/libro_pedido");
const Pedido = require("../models/pedido");

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtener todos los libros alfabéticamente.
 *     description: Obtiene una lista de todos los libros ordenados alfabéticamente por título.
 *     tags:
 *       - Libros
 *     responses:
 *       200:
 *         description: Lista de libros recuperada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/libro'
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crear un nuevo libro.
 *     description: Crea un nuevo libro con la información proporcionada.
 *     tags:
 *       - Libros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               li_titulo:
 *                 type: string
 *                 description: Título del libro.
 *               li_autor:
 *                 type: string
 *                 description: Autor del libro.
 *               li_anio_publicacion:
 *                 type: integer
 *                 description: Año de publicación del libro.
 *               li_stock:
 *                 type: integer
 *                 description: Cantidad en stock del libro.
 *               li_estado:
 *                 type: string
 *                 description: Estado del libro.
 *     responses:
 *       201:
 *         description: Libro creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/libro'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", verificarToken, async (req, res) => {
  try {
    const { li_titulo, li_autor, li_anio_publicacion, li_stock, li_estado } =
      req.body;

    let libro = await Libro.create({
      li_titulo,
      li_autor,
      li_anio_publicacion,
      li_stock,
      li_estado,
    });
    res.json(libro);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

/**
 * @swagger
 * /api/libros/{id}:
 *   put:
 *     summary: Actualizar un libro existente.
 *     description: Actualiza los detalles de un libro existente con la información proporcionada.
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               li_titulo:
 *                 type: string
 *                 description: Título del libro.
 *               li_autor:
 *                 type: string
 *                 description: Autor del libro.
 *               li_anio_publicacion:
 *                 type: integer
 *                 description: Año de publicación del libro.
 *               li_stock:
 *                 type: integer
 *                 description: Cantidad en stock del libro.
 *               li_estado:
 *                 type: string
 *                 description: Estado del libro.
 *     responses:
 *       200:
 *         description: Libro actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/libro'
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { li_titulo, li_autor, li_anio_publicacion, li_stock, li_estado } =
      req.body;

    let resultado = await Libro.update(
      {
        li_titulo,
        li_autor,
        li_anio_publicacion,
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

/**
 * @swagger
 * /api/libros/{id}:
 *   delete:
 *     summary: Deshabilitar un libro existente.
 *     description: Deshabilita un libro existente cambiando su estado a 'D' (Deshabilitado).
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a deshabilitar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro deshabilitado con éxito.
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/libros/titulo:
 *   get:
 *     summary: Buscar libros por título.
 *     description: Busca libros por título, utilizando una coincidencia parcial (insensible a mayúsculas y minúsculas).
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: true
 *         description: Título o parte del título del libro a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de libros que coinciden con el título proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/libro'
 *       400:
 *         description: Por favor, proporciona un título para buscar.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/titulo", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/libros/autor:
 *   get:
 *     summary: Buscar libros por autor.
 *     description: Busca libros por autor, utilizando una coincidencia parcial (insensible a mayúsculas y minúsculas).
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: query
 *         name: autor
 *         required: true
 *         description: Nombre del autor o parte del nombre del autor de los libros a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de libros que coinciden con el autor proporcionado, ordenados alfabéticamente por autor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/libro'
 *       400:
 *         description: Por favor, proporciona un autor para buscar.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/autor", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/libros/publicacion:
 *   get:
 *     summary: Buscar libros por año de publicación.
 *     description: Busca libros por año de publicación exacto.
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: query
 *         name: anio
 *         required: true
 *         description: Año de publicación de los libros a buscar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de libros publicados en el año proporcionado, ordenados alfabéticamente por título.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: './models/libro'
 *       400:
 *         description: Por favor, proporciona un año de publicación para buscar.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/publicacion", verificarToken, async (req, res) => {
  try {
    const { anio } = req.query;

    if (!anio) {
      return res.status(400).json({
        message: "Por favor, proporciona un año de publicación para buscar.",
      });
    }

    const libros = await Libro.findAll({
      where: {
        li_anio_publicacion: anio,
      },
      order: [["li_titulo", "ASC"]],
    });

    res.json(libros);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

router.get("/:id", verificarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await Libro.findByPk(id);

    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar el libro", error: error });
  }
});

router.get("/filtrar/maspedidos", verificarToken, async (req, res) => {
  try {
    const librosMasPedidos = await Libro.findAll({
      attributes: [
        "li_secuencial",
        "li_titulo",
        "li_autor",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM pedidos.libro_pedido WHERE lip_libro = "Libro"."li_secuencial")`
          ),
          "cantidad_pedidos",
        ],
      ],
      where: Sequelize.literal(
        `(SELECT COUNT(*) FROM pedidos.libro_pedido WHERE lip_libro = "Libro"."li_secuencial") > 0`
      ),
      order: [[Sequelize.literal('"cantidad_pedidos"'), "DESC"]],
      limit: 10,
    });

    res.json(librosMasPedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/filtrar/disponibles", async (req, res) => {
  try {
    const librosDisponibles = await Libro.findAll({
      where: {
        li_stock: {
          [Sequelize.Op.gt]: 0,
        },
      },
    });

    if (librosDisponibles.length === 0) {
      return res.status(404).json({ message: "No hay libros disponibles." });
    }

    res.json(librosDisponibles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener los libros disponibles",
      error: error.message,
    });
  }
});

router.get("/pedido-libro/:idPedido", async (req, res) => {
  try {
    const idPedido = req.params.idPedido;

    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const libroPedido = await LibroPedido.findOne({
      where: { lip_pedido: idPedido },
    });

    if (!libroPedido) {
      return res
        .status(404)
        .json({ message: "Libro del pedido no encontrado" });
    }

    const libro = await Libro.findByPk(libroPedido.lip_libro);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json({ pedido: pedido, libro: libro });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

module.exports = router;
