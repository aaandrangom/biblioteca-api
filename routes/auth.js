const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Inicia sesión de un usuario utilizando su nickname y contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usr_nickname:
 *                 type: string
 *                 description: El nickname del usuario.
 *               usr_contrasenia:
 *                 type: string
 *                 description: La contraseña del usuario.
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito.
 *       401:
 *         description: Autenticación fallida.
 */
router.post("/login", async (req, res) => {
  const { usr_nickname, usr_contrasenia } = req.body;

  const usuario = await Usuario.findOne({ where: { usr_nickname } });

  if (
    !usuario ||
    !bcrypt.compareSync(usr_contrasenia, usuario.usr_contrasenia)
  ) {
    return res.status(401).json({ message: "Autenticación fallida" });
  }

  if (!usuario.usr_verificado) {
    return res.status(401).json({ message: "La cuenta no está verificada" });
  }

  const token = jwt.sign(
    { usr_cedula: usuario.usr_cedula, usr_rol: usuario.usr_rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;
