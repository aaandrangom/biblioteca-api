const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); 

const LibroPedido = sequelize.define('LibroPedido', {
    lip_secuencial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lip_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lip_libro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lip_codigo_unico_libro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lip_fecha_entrega_cliente: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lip_fecha_devolucion: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    lip_estado: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    lip_fecha_bd: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'libro_pedido',
    freezeTableName: true,
    timestamps: false
});

module.exports = LibroPedido;
