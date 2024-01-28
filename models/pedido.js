const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); 
const Usuario = require('../models/usuario')

const Pedido = sequelize.define('Pedido', {
    ped_secuencial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ped_usuario: {
        type: DataTypes.STRING(13),
        references: {
            model: Usuario,
            key: 'usr_cedula'
        }
    },
    ped_fecha_solicitud: {
        type: DataTypes.DATEONLY, 
        defaultValue: DataTypes.NOW
    },
    ped_fecha_devolucion: {
        type: DataTypes.DATEONLY, 
        allowNull: true
    },
    ped_estado: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    ped_fecha_bd: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'pedido',
    freezeTableName: true,
    timestamps: false
});

module.exports = Pedido;
