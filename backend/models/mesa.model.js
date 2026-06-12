const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Users = require('./users.model.js');

const Mesa = sequelize.define('Mesa', {
    id_mesa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_mesa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cantidad_personas: {
        type: DataTypes.INTEGER,    
        allowNull: true,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.ENUM('Libre', 'Ocupada', 'Reservada', 'Limpieza'),
        allowNull: false,
        defaultValue: 'Libre',
    },
        comentarios: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: 'disponible',
    },
        tiempo_ocupada: {
        type: DataTypes.INTEGER,    
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER, 
        allowNull: true
    },
        id_ambiente: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'mesa',
    timestamps: false
});
 
//RELACION: UNA MESA PERTENECE A UN USUARIO
Mesa.belongsTo(Users, {foreignKey: 'id_usuario'});
Users.hasMany(Mesa, {foreignKey: 'id_usuario'});

module.exports = Mesa; 