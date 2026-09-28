const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Mesa = require('./mesa.model.js');

const Comanda = sequelize.define('Comanda', {
    id_comanda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_mesa: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'En preparacion', 'Listo', 'Entregado', 'Cancelado', 'Cobrado'),
        allowNull: false,
        defaultValue: 'Pendiente'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Comanda',
    timestamps: false
});

Comanda.belongsTo(Mesa, { foreignKey: 'id_mesa' });
Mesa.hasMany(Comanda, { foreignKey: 'id_mesa' });

module.exports = Comanda;
