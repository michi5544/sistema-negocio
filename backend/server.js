const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.js');
const productRoutes = require('./routes/product.routes');
const customersRoutes = require('./routes/customers.routes.js')
const saleRoutes = require('./routes/sale.routes.js');
const saleDetailRoutes = require('./routes/saleDetail.routes.js');
const userRoutes = require('./routes/users.routes.js')
const authRoutes = require('./routes/auth.router.js');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/sale-details', saleDetailRoutes);
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);

// Ruta de prueba
// app.get('/', (req, res) => {
//   res.send('Servidor funcionando 🚀');
// });

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


//Sincronizar tablas
sequelize.sync({ force: false })
  .then(() => console.log('Tablas sincronizadas'))
  .catch(err => console.error(err));

