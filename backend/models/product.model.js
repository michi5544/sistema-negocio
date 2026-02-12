//    ARMANDO EL CRUD DE PRODUCTOS
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'products',
  timestamps: false   // 👈 evita que Sequelize use createdAt/updatedAt
});

module.exports = Product;
