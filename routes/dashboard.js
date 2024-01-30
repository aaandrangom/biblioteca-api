const express = require("express");
const router = express.Router();
const Libro = require("../models/libro");
const Pedido = require("../models/pedido");
const Usuario = require("../models/usuario");
const verificarToken = require("../middleware/authMiddleware");

router.get("/", verificarToken, async (req, res) => {
  try {
    const totalLibros = await Libro.count();
    const librosHabilitados = await Libro.count({
      where: { li_estado: "H" },
    });
    const librosDeshabilitados = await Libro.count({
      where: { li_estado: "D" },
    });

    const pedidosEnEspera = await Pedido.count({
      where: { ped_estado: "P" },
    });
    const pedidosAceptados = await Pedido.count({
      where: { ped_estado: "A" },
    });

    const administradores = await Usuario.count({
      where: { usr_rol: 1 },
    });

    const bibliotecarios = await Usuario.count({
      where: { usr_rol: 3 },
    });

    const clientes = await Usuario.count({
      where: { usr_rol: 2 },
    });

    const usuarios = await Usuario.count();

    res.json({
      totalLibros,
      librosHabilitados,
      librosDeshabilitados,
      pedidosEnEspera,
      pedidosAceptados,
      administradores,
      bibliotecarios,
      clientes,
      usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
