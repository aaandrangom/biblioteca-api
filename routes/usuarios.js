const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const verificarToken = require("../middleware/authMiddleware");
const {
  enviarCodigoVerificacion,
} = require("../helpers/codigoVerificacionHelpers");

// Obtiene todos los usuarios ordenados alfabeticamente
router.get("/", verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      order: [["usr_nombre_completo", "ASC"]],
    });
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Obtiene un usuario por su cedula
router.get("/cedula", async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res
        .status(400)
        .json({ message: "Por favor, proporciona una cédula para buscar." });
    }

    const usuario = await Usuario.findOne({
      where: {
        usr_cedula: cedula,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json(usuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Actualiza la información de un usuario por su cédula
router.put("/cedula", async (req, res) => {
  try {
    const { cedula } = req.body;
    const datosActualizados = req.body;

    const resultado = await Usuario.update(datosActualizados, {
      where: { usr_cedula: cedula },
    });

    if (resultado[0] > 0) {
      res.json({ message: "Información del usuario actualizada" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Crea un usuario
router.post("/", async (req, res) => {
  try {
    const {
      usr_cedula,
      usr_primer_nombre,
      usr_segundo_nombre,
      usr_primer_apellido,
      usr_segundo_apellido,
      usr_email,
      usr_contrasenia,
      usr_fecha_nacimiento,
      usr_rol,
      usr_estado,
    } = req.body;

    const codigoVerificacion = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const nuevoUsuario = await Usuario.create({
      usr_cedula,
      usr_primer_nombre,
      usr_segundo_nombre,
      usr_primer_apellido,
      usr_segundo_apellido,
      usr_email,
      usr_contrasenia,
      usr_fecha_nacimiento,
      usr_rol,
      usr_estado,
      usr_codigo_verificacion: codigoVerificacion,
      usr_verificado: false,
    });

    await enviarCodigoVerificacion(usr_email, codigoVerificacion);

    const usuarioRespuesta = {
      usr_cedula: nuevoUsuario.usr_cedula,
      usr_primer_nombre: nuevoUsuario.usr_primer_nombre,
      usr_segundo_nombre: nuevoUsuario.usr_segundo_nombre,
      usr_primer_apellido: nuevoUsuario.usr_primer_apellido,
      usr_segundo_apellido: nuevoUsuario.usr_segundo_apellido,
      usr_email: nuevoUsuario.usr_email,
      usr_fecha_nacimiento: nuevoUsuario.usr_fecha_nacimiento,
      usr_rol: nuevoUsuario.usr_rol,
      usr_estado: nuevoUsuario.usr_estado,
      usr_verificado: nuevoUsuario.usr_verificado,
    };

    res.status(201).json({
      message: "Usuario creado. Por favor, verifica tu correo electrónico.",
      usuario: usuarioRespuesta,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

// Actualiza un usuario por su numero de cedula
router.put("/cedula", async (req, res) => {
  try {
    const { cedula } = req.body;
    const {
      usr_primer_nombre,
      usr_segundo_nombre,
      usr_primer_apellido,
      usr_segundo_apellido,
      usr_email,
      usr_contrasenia,
      usr_fecha_nacimiento,
      usr_rol,
      usr_estado,
    } = req.body;

    let datosActualizados = {
      usr_primer_nombre,
      usr_segundo_nombre,
      usr_primer_apellido,
      usr_segundo_apellido,
      usr_email,
      usr_fecha_nacimiento,
      usr_rol,
      usr_estado,
    };

    if (usr_contrasenia) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.usr_contrasenia = await bcrypt.hash(
        usr_contrasenia,
        salt
      );
    }

    const resultado = await Usuario.update(datosActualizados, {
      where: { usr_cedula: cedula },
    });

    if (resultado[0] > 0) {
      res.json({ message: "Información del usuario actualizada" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

router.delete("/cedula", async (req, res) => {
  try {
    const { cedula } = req.body;

    const resultado = await Usuario.update(
      { usr_estado: "D" },
      {
        where: { usr_cedula: cedula },
      }
    );

    if (resultado[0] > 0) {
      res.json({ message: "Usuario deshabilitado" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, status: 500 });
  }
});

router.post("/verificar", async (req, res) => {
  const { usr_email, codigoVerificacion } = req.body;

  const usuario = await Usuario.findOne({ where: { usr_email } });
  if (!usuario || usuario.usr_codigo_verificacion !== codigoVerificacion) {
    return res.status(400).json({
      message: "Código de verificación incorrecto o usuario no encontrado.",
    });
  }

  usuario.usr_verificado = true;
  usuario.usr_codigo_verificacion = null;
  await usuario.save();

  res.status(200).json({ message: "Cuenta verificada con éxito." });
});

module.exports = router;
