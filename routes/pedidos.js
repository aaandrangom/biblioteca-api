const express = require("express");
const router = express.Router();
const Pedido = require("../models/pedido");

router.get("/", async (req, res) => {
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

router.get("/cedula", async (req, res) => {
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

// Obtiene los pedidos de un usuario, de estado R: recibido
router.get("/recibidos", async (req, res) => {
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

// Obtiene los pedidos de un usuario, de estado E: enviado
router.get("/enviados", async (req, res) => {
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

// Obtiene los pedidos de un usuario, de estado P: en procesamiento
router.get("/procesamiento", async (req, res) => {
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

// Obtiene los pedidos de un usuario, de estado A: aceptado
router.get("/enviado", async (req, res) => {
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

// Obtiene los pedidos de un usuario, de estado F: finalizado

router.get("/finalizado", async (req, res) => {
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

// Crea un pedido
router.post("/", async (req, res) => {
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

// Actualiza la informacion de un pedido
router.put("/:id", async (req, res) => {
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
