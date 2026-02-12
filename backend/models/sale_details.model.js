const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Sale  = require('./sale.model.js');
const Product = require('./product.model.js');

const SaleDetail = sequelize.define('SaleDetail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sale_id: { type: DataTypes.INTEGER },     //  FK a Sale
    product_id: { type: DataTypes.INTEGER },  //  FK a Product
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull:false}
}, {
    tableName: 'sale_details',
    timestamps: false
});

SaleDetail.belongsTo(Sale, {foreignKey: 'sale_id'});
Sale.hasMany(SaleDetail, {foreignKey: 'sale_id'});

SaleDetail.belongsTo(Product, {foreignKey: 'product_id'});
Product.hasMany(SaleDetail, {foreignKey:'product_id'});

module.exports = SaleDetail;