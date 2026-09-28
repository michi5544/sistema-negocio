const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./users.model.js');

const Caja = sequelize.define('Caja', {
    id_caja: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario_apertura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_apertura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    monto_inicial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    id_usuario_cierre: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true
    },
    monto_final: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    total_ventas: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    diferencia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Abierta', 'Cerrada'),
        allowNull: false,
        defaultValue: 'Abierta'
    }
}, {
    tableName: 'caja',
    timestamps: false
});

Caja.belongsTo(User, { foreignKey: 'id_usuario_apertura', as: 'UsuarioApertura' });
Caja.belongsTo(User, { foreignKey: 'id_usuario_cierre', as: 'UsuarioCierre' });

module.exports = Caja;
