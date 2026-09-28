const express = require('express');
const router = express.Router();
const DetalleComanda = require('../models/detalle_comanda.model.js');
const Comanda = require('../models/comanda.model.js');
const Product = require('../models/product.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear detalle de comanda — admin y employee
router.post('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { id_comanda, id_producto, cantidad } = req.body;

        const product = await Product.findByPk(id_producto);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const precio_unitario = parseFloat(product.price);
        const subtotal = precio_unitario * cantidad;

        const detalle = await DetalleComanda.create({
            id_comanda,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
        });

        res.status(201).json(detalle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar todos los detalles — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const detalles = await DetalleComanda.findAll({
            include: [
                { model: Comanda, attributes: ['id_comanda', 'estado'] },
                { model: Product, attributes: ['id', 'name', 'price'] }
            ]
        });
        res.json(detalles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un detalle por ID — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleComanda.findByPk(id, {
            include: [
                { model: Comanda, attributes: ['id_comanda', 'estado'] },
                { model: Product, attributes: ['id', 'name', 'price'] }
            ]
        });

        if (!detalle) {
            return res.status(404).json({ error: 'Detalle de comanda no encontrado' });
        }

        res.json(detalle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar detalle de comanda — admin y employee
router.put('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, id_producto } = req.body;

        const detalle = await DetalleComanda.findByPk(id);
        if (!detalle) {
            return res.status(404).json({ error: 'Detalle de comanda no encontrado' });
        }

        const productoId = id_producto ?? detalle.id_producto;
        const product = await Product.findByPk(productoId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const precio_unitario = parseFloat(product.price);
        const nuevaCantidad = cantidad ?? detalle.cantidad;
        const subtotal = precio_unitario * nuevaCantidad;

        await detalle.update({ id_producto: productoId, cantidad: nuevaCantidad, precio_unitario, subtotal });

        res.json({ message: 'Detalle actualizado correctamente', detalle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar detalle de comanda — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleComanda.findByPk(id);

        if (!detalle) {
            return res.status(404).json({ error: 'Detalle de comanda no encontrado' });
        }

        await detalle.destroy();
        res.json({ message: 'Detalle eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
