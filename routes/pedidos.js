const express = require("express");
const router = express.Router();
const Pedido = require("../models/pedido");
const verificarToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos.
 *     description: Obtiene la lista de todos los pedidos de libros.
 *     tags:
 *       - Pedidos
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos de libros, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", verificarToken, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      order: [["ped_fecha_solicitud", "DESC"]],
    });
    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/cedula:
 *   post:
 *     summary: Obtener pedidos por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros asociados a un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos asociados al usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/cedula", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: { ped_usuario: cedula },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/recibidos:
 *   post:
 *     summary: Obtener pedidos recibidos por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros recibidos por un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos recibidos.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos recibidos por el usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/recibidos", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: {
        ped_usuario: cedula,
        ped_estado: "R",
      },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/enviados:
 *   post:
 *     summary: Obtener pedidos enviados por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros enviados por un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos enviados.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos enviados por el usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/enviados", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: {
        ped_usuario: cedula,
        ped_estado: "E",
      },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/procesamiento:
 *   post:
 *     summary: Obtener pedidos en procesamiento por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros en procesamiento por un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos en procesamiento.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos en procesamiento por el usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/procesamiento", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: {
        ped_usuario: cedula,
        ped_estado: "P",
      },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/enviado:
 *   post:
 *     summary: Obtener pedidos aceptados por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros aceptados por un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos aceptados.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos aceptados por el usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/enviado", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: {
        ped_usuario: cedula,
        ped_estado: "A",
      },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/finalizado:
 *   post:
 *     summary: Obtener pedidos finalizados por número de cédula de usuario.
 *     description: Obtiene la lista de pedidos de libros finalizados por un usuario específico mediante su número de cédula.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario para el cual se buscan los pedidos finalizados.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Lista de pedidos finalizados por el usuario correspondiente, ordenados por fecha de solicitud descendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/finalizado", verificarToken, async (req, res) => {
  try {
    const { cedula } = req.body;

    const pedidos = await Pedido.findAll({
      where: {
        ped_usuario: cedula,
        ped_estado: "F",
      },
      order: [["ped_fecha_solicitud", "DESC"]],
    });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido de libros.
 *     description: Crea un nuevo pedido de libros para un usuario.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ped_usuario:
 *                 type: string
 *                 description: Número de cédula o identificador del usuario que realiza el pedido.
 *               ped_fecha_solicitud:
 *                 type: string
 *                 format: date
 *                 description: Fecha de solicitud del pedido.
 *               ped_fecha_devolucion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de devolución prevista para los libros del pedido.
 *               ped_estado:
 *                 type: string
 *                 description: Estado del pedido (por ejemplo, "E" para En Procesamiento).
 *             required:
 *               - ped_usuario
 *               - ped_fecha_solicitud
 *               - ped_fecha_devolucion
 *               - ped_estado
 *     responses:
 *       201:
 *         description: Pedido de libros creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/pedido'
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", verificarToken, async (req, res) => {
  try {
    const {
      ped_usuario,
      ped_fecha_solicitud,
      ped_fecha_devolucion,
      ped_estado,
    } = req.body;

    const nuevoPedido = await Pedido.create({
      ped_usuario,
      ped_fecha_solicitud,
      ped_fecha_devolucion,
      ped_estado,
    });

    res.status(201).json(nuevoPedido);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualizar información de un pedido de libros.
 *     description: Actualiza la información de un pedido de libros existente.
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ped_usuario:
 *                 type: string
 *                 description: Número de cédula o identificador del usuario que realiza el pedido.
 *               ped_fecha_solicitud:
 *                 type: string
 *                 format: date
 *                 description: Fecha de solicitud del pedido.
 *               ped_fecha_devolucion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de devolución prevista para los libros del pedido.
 *               ped_estado:
 *                 type: string
 *                 description: Estado del pedido (por ejemplo, "E" para En Procesamiento).
 *             required:
 *               - ped_usuario
 *               - ped_fecha_solicitud
 *               - ped_fecha_devolucion
 *               - ped_estado
 *     responses:
 *       200:
 *         description: Pedido de libros actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       404:
 *         description: Pedido no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ped_usuario,
      ped_fecha_solicitud,
      ped_fecha_devolucion,
      ped_estado,
    } = req.body;

    const resultado = await Pedido.update(
      { ped_usuario, ped_fecha_solicitud, ped_fecha_devolucion, ped_estado },
      { where: { ped_secuencial: id } }
    );

    if (resultado[0] > 0) {
      res.json({ message: "Pedido actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
