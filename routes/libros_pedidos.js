const express = require("express");
const router = express.Router();
const LibroPedido = require("../models/libro_pedido");
const verificarToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/libros_pedidos:
 *   get:
 *     summary: Obtener lista de libros pedidos
 *     description: Devuelve una lista de todos los libros pedidos en la biblioteca.
 *     tags:
 *       - Libros Pedidos
 *     responses:
 *       '200':
 *         description: Lista de libros pedidos recuperada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: './models/libro_pedido'
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/", verificarToken, async (req, res) => {
  try {
    const librosPedidos = await LibroPedido.findAll();
    res.json(librosPedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

/**
 * @swagger
 * /api/libros_pedidos/{id}:
 *   get:
 *     summary: Obtener un libro pedido por ID
 *     description: Devuelve un libro pedido específico en la biblioteca basado en su ID.
 *     tags:
 *       - Libros Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro pedido que se desea recuperar.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Libro pedido recuperado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/libro_pedido'
 *       '404':
 *         description: Libro pedido no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const libroPedido = await LibroPedido.findByPk(req.params.id);

    if (libroPedido) {
      res.json(libroPedido);
    } else {
      res.status(404).json({ message: "Libro_pedido no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

/**
 * @swagger
 * /api/libros_pedidos:
 *   post:
 *     summary: Crear un nuevo libro pedido
 *     description: Crea un nuevo libro pedido en la biblioteca.
 *     tags:
 *       - Libros Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lip_pedido:
 *                 type: integer
 *                 description: ID del pedido relacionado.
 *               lip_libro:
 *                 type: integer
 *                 description: ID del libro relacionado.
 *               lip_codigo_unico_libro:
 *                 type: string
 *                 description: Código único del libro.
 *               lip_fecha_entrega_cliente:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrega al cliente.
 *               lip_fecha_devolucion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de devolución del libro.
 *               lip_estado:
 *                 type: string
 *                 description: Estado del libro pedido.
 *     responses:
 *       '201':
 *         description: Libro pedido creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/libro_pedido'
 *       '500':
 *         description: Error interno del servidor.
 */
router.post("/", verificarToken, async (req, res) => {
  try {
    const {
      lip_pedido,
      lip_libro,
      lip_codigo_unico_libro,
      lip_fecha_entrega_cliente,
      lip_fecha_devolucion,
      lip_estado,
    } = req.body;

    const nuevoLibroPedido = await LibroPedido.create({
      lip_pedido,
      lip_libro,
      lip_codigo_unico_libro,
      lip_fecha_entrega_cliente,
      lip_fecha_devolucion,
      lip_estado,
    });

    res.json(nuevoLibroPedido);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

/**
 * @swagger
 * /api/libros_pedidos/{id}:
 *   put:
 *     summary: Actualizar un libro pedido por ID
 *     description: Actualiza un libro pedido específico en la biblioteca basado en su ID.
 *     tags:
 *       - Libros Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro pedido que se desea actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lip_pedido:
 *                 type: integer
 *                 description: ID del pedido relacionado.
 *               lip_libro:
 *                 type: integer
 *                 description: ID del libro relacionado.
 *               lip_codigo_unico_libro:
 *                 type: string
 *                 description: Código único del libro.
 *               lip_fecha_entrega_cliente:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrega al cliente.
 *               lip_fecha_devolucion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de devolución del libro.
 *               lip_estado:
 *                 type: string
 *                 description: Estado del libro pedido.
 *     responses:
 *       '200':
 *         description: Libro pedido actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: './models/libro_pedido'
 *       '404':
 *         description: Libro pedido no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const {
      lip_pedido,
      lip_libro,
      lip_codigo_unico_libro,
      lip_fecha_entrega_cliente,
      lip_fecha_devolucion,
      lip_estado,
    } = req.body;

    const resultado = await LibroPedido.update(
      {
        lip_pedido,
        lip_libro,
        lip_codigo_unico_libro,
        lip_fecha_entrega_cliente,
        lip_fecha_devolucion,
        lip_estado,
      },
      {
        where: { lip_secuencial: req.params.id },
      }
    );

    if (resultado[0] > 0) {
      const libroPedidoActualizado = await LibroPedido.findByPk(req.params.id);
      res.json(libroPedidoActualizado);
    } else {
      res.status(404).json({ message: "Libro_pedido no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

/**
 * @swagger
 * /api/libros_pedidos/{id}:
 *   delete:
 *     summary: Eliminar un libro pedido por ID
 *     description: Elimina un libro pedido específico en la biblioteca basado en su ID.
 *     tags:
 *       - Libros Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro pedido que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Libro pedido eliminado con éxito.
 *       '404':
 *         description: Libro pedido no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const resultado = await LibroPedido.destroy({
      where: { lip_secuencial: req.params.id },
    });

    if (resultado > 0) {
      res.json({ message: "Libro_pedido eliminado" });
    } else {
      res.status(404).json({ message: "Libro_pedido no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

module.exports = router;
