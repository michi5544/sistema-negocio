const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Ambiente = sequelize.define('Ambiente', {
    id_ambiente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
        codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Ambiente'
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'ambiente',
    timestamps: false
});

module.exports = Ambiente;