const { Sequelize } = require('sequelize');
const path = require('path');

// Usa path explícito para que funcione tanto en dev como en el ejecutable empaquetado
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize( //CONFIGURANDDO LA CONEXION
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
);

sequelize.authenticate()
  .then(() => console.log(' Conectado a MySQL'))
  .catch(err => console.error(' Error de conexión:', err));

module.exports = sequelize;
