// Registra todos los modelos con Sequelize antes de llamar a sync().
// El orden respeta las dependencias de claves foráneas.

// Sin dependencias
require('./users.model.js');
require('./customers.model.js');
require('./product.model.js');
require('./ambiente.model.js');

// Dependen de los anteriores
require('./mesa.model.js');       // FK → users, ambiente
require('./sale.model.js');       // FK → customers
require('./caja.model.js');       // FK → users

// Dependen del nivel anterior
require('./sale_details.model.js');    // FK → sale, product
require('./comanda.model.js');         // FK → mesa

// Dependen del nivel anterior
require('./detalle_comanda.model.js'); // FK → comanda, product
