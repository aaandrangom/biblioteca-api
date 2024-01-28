const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { usr_nickname, usr_contrasenia } = req.body;

  // Buscar el usuario por su nickname
  const usuario = await Usuario.findOne({ where: { usr_nickname } });

  // Comprobar si el usuario existe y la contraseña es correcta
  if (
    !usuario ||
    !bcrypt.compareSync(usr_contrasenia, usuario.usr_contrasenia)
  ) {
    return res.status(401).json({ message: "Autenticación fallida" });
  }

  // Comprobar si el usuario está verificado
  if (!usuario.usr_verificado) {
    return res.status(401).json({ message: "La cuenta no está verificada" });
  }

  // Si todo está correcto, generar y enviar el token
  const token = jwt.sign(
    { usr_cedula: usuario.usr_cedula, usr_rol: usuario.usr_rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;
