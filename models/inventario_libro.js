const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const InventarioLibro = sequelize.define(
  "InventarioLibro",
  {
    invl_secuencial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invl_libro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invl_estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    invl_fecha_bd: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inventario_libro",
    timestamps: false,
  }
);

module.exports = InventarioLibro;
