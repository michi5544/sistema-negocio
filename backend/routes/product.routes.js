const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear producto — solo admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar productos — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por ID — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'price', 'stock']
    });

    if (!product) {
       return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Producto no encontrado' });
  }
});

// Actualizar producto — solo admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const [update] = await Product.update(req.body, {
      where: { id }
    });

    if (update === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'price', 'stock']
    });

    res.json({ message: 'Producto actualizado', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
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
