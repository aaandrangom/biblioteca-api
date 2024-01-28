const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Libro = sequelize.define('Libro', {
    li_secuencial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    li_titulo: {
        type: DataTypes.STRING(500),
        allowNull: false        
    },
    li_autor: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    li_año_publicacion: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    li_stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    li_estado: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    li_fecha_bd: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'libro', 
    freezeTableName: true,
    timestamps: false
});

module.exports = Libro;
