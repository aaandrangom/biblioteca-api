const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const bcrypt = require("bcryptjs");

const Usuario = sequelize.define(
  "Usuario",
  {
    usr_cedula: {
      type: DataTypes.STRING(13),
      primaryKey: true,
    },
    usr_primer_nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usr_segundo_nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usr_primer_apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usr_segundo_apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usr_nombre_completo: {
      type: DataTypes.STRING(400),
    },
    usr_nickname: {
      type: DataTypes.STRING(20),
    },
    usr_email: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    usr_contrasenia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usr_fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usr_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usr_estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    usr_fecha_bd: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    usr_codigo_verificacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usr_verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "usuario",
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeSave: async (usuario, options) => {
        usuario.usr_nombre_completo = `${usuario.usr_primer_apellido || ""} ${
          usuario.usr_segundo_apellido || ""
        } ${usuario.usr_primer_nombre || ""} ${
          usuario.usr_segundo_nombre || ""
        }`.trim();

        usuario.usr_nickname = generarNickname(usuario);

        if (usuario.changed("usr_contrasenia")) {
          const salt = await bcrypt.genSalt(10);
          usuario.usr_contrasenia = await bcrypt.hash(
            usuario.usr_contrasenia,
            salt
          );
        }
      },
    },
  }
);

function generarNickname(usuario) {
  const primerLetraPrimerNombre = usuario.usr_primer_nombre
    ? usuario.usr_primer_nombre[0].toLowerCase()
    : "";
  const primerLetraSegundoNombre = usuario.usr_segundo_nombre
    ? usuario.usr_segundo_nombre[0].toLowerCase()
    : "";
  const primerApellido = usuario.usr_primer_apellido
    ? usuario.usr_primer_apellido.toLowerCase()
    : "";
  const primerLetraSegundoApellido = usuario.usr_segundo_apellido
    ? usuario.usr_segundo_apellido[0].toLowerCase()
    : "";
  const diaNacimiento = usuario.usr_fecha_nacimiento
    ? String(new Date(usuario.usr_fecha_nacimiento).getUTCDate())
    : "";

  return `${primerLetraPrimerNombre}${primerLetraSegundoNombre}${primerApellido}${primerLetraSegundoApellido}${diaNacimiento}`;
}

module.exports = Usuario;
