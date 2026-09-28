const mysql2 = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Conecta a MySQL SIN base de datos y la crea si no existe.
// Debe ejecutarse antes de sequelize.sync() para que la BD exista.
async function initDatabase() {
    const dbName = process.env.DB_NAME || 'sistema_negocio';

    const connection = await mysql2.createConnection({
        host:     process.env.DB_HOST || 'localhost',
        port:     parseInt(process.env.DB_PORT) || 3306,
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASS || ''
    });

    await connection.execute(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    console.log(`Base de datos "${dbName}" verificada.`);
    await connection.end();
}

module.exports = initDatabase;
