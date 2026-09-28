const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/db.js');
const initDatabase = require('./config/initDatabase.js');
const seedAdmin = require('./config/seed.js');
require('./models/index.js'); // registra todos los modelos antes del sync
const productRoutes = require('./routes/product.routes');
const customersRoutes = require('./routes/customers.routes.js')
const saleRoutes = require('./routes/sale.routes.js');
const saleDetailRoutes = require('./routes/saleDetail.routes.js');
const userRoutes = require('./routes/users.routes.js')
const authRoutes = require('./routes/auth.router.js');
const MesaRoutes = require('./routes/mesa.router.js');
const AmbienteRoutes = require('./routes/ambiente.router.js');
const ComandaRoutes = require('./routes/comanda.router.js');
const DetalleComandaRoutes = require('./routes/detalle_comanda.router.js');
const CajaRoutes = require('./routes/caja.router.js');

const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend estático para acceso desde navegador / móvil en la misma red.
// Electron ignora esto porque carga la UI por file://, no por HTTP.
// Busca el dist en la ruta de desarrollo y luego en la ruta del ejecutable empaquetado.
const frontendDist = [
  path.join(__dirname, '../frontend/dist'), // desarrollo
  path.join(__dirname, '../frontend'),       // ejecutable empaquetado
].find(p => fs.existsSync(p));

if (frontendDist) {
  app.use(express.static(frontendDist));
}

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/sale-details', saleDetailRoutes);
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/mesa', MesaRoutes);
app.use('/api/ambiente', AmbienteRoutes);
app.use('/api/comandas', ComandaRoutes);
app.use('/api/detalle-comanda', DetalleComandaRoutes);
app.use('/api/caja', CajaRoutes);

// Health check (no interfiere con el frontend estático)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback: cualquier ruta no-API devuelve index.html para que
// HashRouter maneje la navegación en el cliente.
// Solo activo si el frontend está disponible.
if (frontendDist) {
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      next();
    }
  });
}


// Secuencia de inicio: crear BD → sincronizar tablas → seed → escuchar
initDatabase()
  .then(() => sequelize.sync({ force: false }))
  .then(async () => {
    console.log('Tablas sincronizadas');
    await seedAdmin();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log('SERVER_READY');
    });
  })
  .catch(err => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  });