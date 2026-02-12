const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear producto
router.post('/', async (req, res) => {    
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar productos
router.get('/',
  //authenticateToken ,authorizeRole('admin') , quitar comentario despues de pruebas
async (req, res) => { //authenticateToken protegiendo las rutas | authorizeRole: autoriza solo a admin a entrar a api productos
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'price', 'stock']
    });

    if (!product) {
       return res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (err) {
    res.status(500).json({ error: 'Producto no encontrado' });
  }
});

// Obtener producto por otro campo
router.get('/:id', async (req, res) => {
     try {
       const { id } = req.params;

       const product = await Product.findOne({
         where: { id },
         attributes: ['id', 'name', 'description', 'price', 'stock']
       });

       if (!product) {
         return res.status(404).json({ error: 'Producto no encontrado' });
       } else {
         res.json(product);
       }
     } catch (err) {
       res.status(500).json({ error: 'Producto no encontrado' });
     }
   });

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [update] = await Product.update(req.body, { 
      where: { id } 
    });

    if (update === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // obtener el producto actualizado para devolverlo
    const updatedProduct = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'price', 'stock']
    });

    res.json({ message: 'Producto actualizado', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.destroy({ 
      where: { id } 
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
