//      ARMANDO CRUD DE CLIENTES
const {DataTypes} = require('sequelize');
const sequelize = require('../config/db.js')

const Customer = sequelize.define('Customers', {
name:{type: DataTypes.STRING, allowNull: false},
email: DataTypes.TEXT,
phone: DataTypes.TEXT,
address: DataTypes.TEXT
}, {
    tableName: 'customers',
    timestamps: false
});

module.exports = Customer;