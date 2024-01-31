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

  try {
    const usuario = await Usuario.findOne({ where: { usr_nickname } });

    if (!usuario) {
      return res
        .status(404)
        .json({ codigo: 2, message: "Usuario no encontrado" });
    }

    if (!bcrypt.compareSync(usr_contrasenia, usuario.usr_contrasenia)) {
      return res
        .status(401)
        .json({ codigo: 3, message: "Contraseña incorrecta" });
    }

    if (!usuario.usr_verificado) {
      return res
        .status(401)
        .json({ codigo: 4, message: "La cuenta no está verificada" });
    }

    const token = jwt.sign(
      { usr_cedula: usuario.usr_cedula, usr_rol: usuario.usr_rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const usuarioRespuesta = {
      usr_cedula: usuario.usr_cedula,
      usr_nickname: usuario.usr_nickname,
      usr_email: usuario.usr_email,
      usr_nombre_completo: usuario.usr_nombre_completo,
    };

    res.json({
      codigo: 1,
      message: "Autenticación exitosa",
      token: token,
      usuario: usuarioRespuesta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      codigo: 5,
      message: "Error en el servidor",
      error: error.message,
    });
  }
});

module.exports = router;
