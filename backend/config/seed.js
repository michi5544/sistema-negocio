const bcrypt = require('bcryptjs');
const Users = require('../models/users.model.js');

// Crea el usuario admin por defecto si la tabla users está vacía.
// Ejecutar después de sequelize.sync().
async function seedAdmin() {
    const count = await Users.count();
    if (count > 0) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await Users.create({
        name:     'Administrador',
        email:    'admin@sistema.com',
        password: hashedPassword,
        role:     'admin'
    });

    console.log('======================================');
    console.log('  Usuario admin creado por defecto:');
    console.log('  Email   : admin@sistema.com');
    console.log('  Password: admin123');
    console.log('  Cambia la contraseña después del primer login.');
    console.log('======================================');
}

module.exports = seedAdmin;
