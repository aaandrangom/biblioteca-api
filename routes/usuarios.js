const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const verificarToken = require("../middleware/authMiddleware");
const {
  enviarCodigoVerificacion,
} = require("../helpers/codigoVerificacionHelpers");

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener la lista de usuarios.
 *     description: Obtiene la lista de todos los usuarios registrados en la aplicación.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []  # Requiere autenticación mediante token
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/usuario'
 *       401:
 *         description: Acceso no autorizado o token inválido.
 *       500:
 *         description: Error interno del servidor al obtener la lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP (500 en caso de error).
 */
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

/**
 * @swagger
 * /api/usuarios/cedula:
 *   get:
 *     summary: Obtener un usuario por número de cédula.
 *     description: Obtiene un usuario específico mediante su número de cédula.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: query
 *         name: cedula
 *         required: true
 *         description: Número de cédula del usuario que se desea buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario correspondiente a la cédula proporcionada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/usuario'
 *       400:
 *         description: Bad Request. La solicitud es inválida debido a una cédula no proporcionada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error explicando la falta de cédula.
 *       404:
 *         description: No se encontró ningún usuario con la cédula proporcionada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error indicando que no se encontró el usuario.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error detallado del servidor.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP 500.
 */
router.get("/cedula", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario.
 *     description: Crea un nuevo usuario en el sistema.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usr_cedula:
 *                 type: string
 *                 description: Número de cédula del usuario.
 *               usr_primer_nombre:
 *                 type: string
 *                 description: Primer nombre del usuario.
 *               usr_segundo_nombre:
 *                 type: string
 *                 description: Segundo nombre del usuario (opcional).
 *               usr_primer_apellido:
 *                 type: string
 *                 description: Primer apellido del usuario.
 *               usr_segundo_apellido:
 *                 type: string
 *                 description: Segundo apellido del usuario (opcional).
 *               usr_email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               usr_contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario.
 *               usr_fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento del usuario (en formato YYYY-MM-DD).
 *               usr_rol:
 *                 type: string
 *                 description: Rol del usuario en el sistema.
 *               usr_estado:
 *                 type: string
 *                 description: Estado del usuario (por ejemplo, "Activo").
 *             required:
 *               - usr_cedula
 *               - usr_primer_nombre
 *               - usr_primer_apellido
 *               - usr_email
 *               - usr_contrasenia
 *               - usr_fecha_nacimiento
 *               - usr_rol
 *               - usr_estado
 *     responses:
 *       201:
 *         description: Usuario creado con éxito. Se envió un correo electrónico de verificación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     usr_cedula:
 *                       type: string
 *                       description: Número de cédula del usuario.
 *                     usr_primer_nombre:
 *                       type: string
 *                       description: Primer nombre del usuario.
 *                     usr_segundo_nombre:
 *                       type: string
 *                       description: Segundo nombre del usuario (opcional).
 *                     usr_primer_apellido:
 *                       type: string
 *                       description: Primer apellido del usuario.
 *                     usr_segundo_apellido:
 *                       type: string
 *                       description: Segundo apellido del usuario (opcional).
 *                     usr_email:
 *                       type: string
 *                       format: email
 *                       description: Correo electrónico del usuario.
 *                     usr_fecha_nacimiento:
 *                       type: string
 *                       format: date
 *                       description: Fecha de nacimiento del usuario (en formato YYYY-MM-DD).
 *                     usr_rol:
 *                       type: string
 *                       description: Rol del usuario en el sistema.
 *                     usr_estado:
 *                       type: string
 *                       description: Estado del usuario (por ejemplo, "Activo").
 *                     usr_verificado:
 *                       type: boolean
 *                       description: Indica si el usuario ha verificado su correo electrónico.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error detallado del servidor.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP 500.
 */
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

/**
 * @swagger
 * /api/usuarios/cedula:
 *   put:
 *     summary: Actualizar información de un usuario por número de cédula.
 *     description: Actualiza la información de un usuario existente identificado por su número de cédula.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario que se desea actualizar.
 *               usr_primer_nombre:
 *                 type: string
 *                 description: Nuevo primer nombre del usuario.
 *               usr_segundo_nombre:
 *                 type: string
 *                 description: Nuevo segundo nombre del usuario (opcional).
 *               usr_primer_apellido:
 *                 type: string
 *                 description: Nuevo primer apellido del usuario.
 *               usr_segundo_apellido:
 *                 type: string
 *                 description: Nuevo segundo apellido del usuario (opcional).
 *               usr_email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del usuario.
 *               usr_contrasenia:
 *                 type: string
 *                 description: Nueva contraseña del usuario (opcional).
 *               usr_fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de nacimiento del usuario (en formato YYYY-MM-DD).
 *               usr_rol:
 *                 type: string
 *                 description: Nuevo rol del usuario en el sistema.
 *               usr_estado:
 *                 type: string
 *                 description: Nuevo estado del usuario (por ejemplo, "Activo").
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Información del usuario actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error detallado del servidor.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP 500.
 */
router.put("/cedula", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/usuarios/cedula:
 *   delete:
 *     summary: Deshabilitar un usuario por número de cédula.
 *     description: Deshabilita un usuario existente identificado por su número de cédula.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Número de cédula del usuario que se desea deshabilitar.
 *             required:
 *               - cedula
 *     responses:
 *       200:
 *         description: Usuario deshabilitado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error detallado del servidor.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP 500.
 */
router.delete("/cedula", verificarToken, async (req, res) => {
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

/**
 * @swagger
 * /api/usuarios/verificar:
 *   post:
 *     summary: Verificar la cuenta de un usuario.
 *     description: Verifica la cuenta de un usuario mediante el código de verificación enviado por correo electrónico.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usr_email:
 *                 type: string
 *                 description: Correo electrónico del usuario cuya cuenta se desea verificar.
 *               codigoVerificacion:
 *                 type: string
 *                 description: Código de verificación enviado al usuario por correo electrónico.
 *             required:
 *               - usr_email
 *               - codigoVerificacion
 *     responses:
 *       200:
 *         description: Cuenta verificada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       400:
 *         description: Código de verificación incorrecto o usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error detallado del servidor.
 *                 status:
 *                   type: integer
 *                   description: Código de estado HTTP 500.
 */
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

  const usuarioRespuesta = {
    usr_nickname: usuario.usr_nickname,
  };

  res.status(200).json({
    message: "Cuenta verificada con éxito.",
    usuario: usuarioRespuesta,
  });
});

router.get("/filtrar", async (req, res) => {
  const { rol } = req.query;

  if (!rol) {
    return res.status(400).json({ message: "Por favor, proporciona un rol." });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: { usr_rol: rol },
    });

    if (usuarios.length === 0) {
      return res.status(404).json({
        message: "No se encontraron usuarios con el rol proporcionado.",
      });
    }

    res.json({ message: "Usuarios encontrados con éxito", usuarios });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
