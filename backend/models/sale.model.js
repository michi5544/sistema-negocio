const { DataTypes } = require('sequelize'); 
const sequelize = require('../config/db');
const Customer = require('./customers.model.js');

const Sale = sequelize.define('Sale', {
    id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  total: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  customer_id: { type: DataTypes.INTEGER, allowNull: false }, // llave Fk
  user_id: { type: DataTypes.INTEGER, allowNull: false }

}, {
    tableName: 'sales',
    timestamps: false
});

//RELACION: UNA VENTA PERTENECE A UN CLIENTE
Sale.belongsTo(Customer, {foreignKey: 'customer_id'});
Customer.hasMany(Sale, {foreignKey: 'customer_id'});

module.exports = Sale;