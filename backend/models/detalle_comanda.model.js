const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Comanda = require('./comanda.model.js');
const Product = require('./product.model.js');

const DetalleComanda = sequelize.define('DetalleComanda', {
    id_detalle_comanda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_comanda: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'DetalleComanda',
    timestamps: false
});

DetalleComanda.belongsTo(Comanda, { foreignKey: 'id_comanda' });
Comanda.hasMany(DetalleComanda, { foreignKey: 'id_comanda' });

DetalleComanda.belongsTo(Product, { foreignKey: 'id_producto' });
Product.hasMany(DetalleComanda, { foreignKey: 'id_producto' });

module.exports = DetalleComanda;
