const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/db.js');
const Comanda = require('../models/comanda.model.js');
const DetalleComanda = require('../models/detalle_comanda.model.js');
const Product = require('../models/product.model.js');
const Mesa = require('../models/mesa.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear comanda con sus detalles — admin y employee
router.post('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_mesa, estado, productos } = req.body;

        if (!id_mesa || !productos || productos.length === 0) {
            await t.rollback();
            return res.status(400).json({ error: 'Faltan campos obligatorios: id_mesa y productos' });
        }

        const comanda = await Comanda.create(
            { id_mesa, estado: estado || 'Pendiente' },
            { transaction: t }
        );

        for (const p of productos) {
            const product = await Product.findByPk(p.id_producto, { transaction: t });
            if (!product) {
                await t.rollback();
                return res.status(404).json({ error: `Producto con id ${p.id_producto} no encontrado` });
            }

            const stockActual = product.stock ?? 0;
            if (stockActual < p.cantidad) {
                await t.rollback();
                return res.status(400).json({
                    error: `Stock insuficiente para "${product.name}". Disponible: ${stockActual}, solicitado: ${p.cantidad}`
                });
            }

            await product.update({ stock: stockActual - p.cantidad }, { transaction: t });

            const precio_unitario = parseFloat(product.price);
            const subtotal = precio_unitario * p.cantidad;

            await DetalleComanda.create({
                id_comanda: comanda.id_comanda,
                id_producto: p.id_producto,
                cantidad: p.cantidad,
                precio_unitario,
                subtotal
            }, { transaction: t });
        }

        await t.commit();
        res.status(201).json({ message: 'Comanda registrada', id_comanda: comanda.id_comanda });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
});

// Listar comandas — filtros opcionales: desde, hasta, id_mesa
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { desde, hasta, id_mesa } = req.query;
        const where = {};

        if (id_mesa) where.id_mesa = id_mesa;

        if (desde || hasta) {
            where.fecha_creacion = {};
            if (desde) {
                where.fecha_creacion[Op.gte] = desde.includes('T') ? new Date(desde) : new Date(desde + 'T00:00:00');
            }
            if (hasta) {
                where.fecha_creacion[Op.lte] = hasta.includes('T') ? new Date(hasta) : new Date(hasta + 'T23:59:59');
            }
        }

        const comandas = await Comanda.findAll({
            where,
            include: [
                { model: Mesa, attributes: ['id_mesa', 'numero_mesa', 'estado'] },
                {
                    model: DetalleComanda,
                    include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
                }
            ],
            order: [['id_comanda', 'DESC']]
        });
        res.json(comandas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una comanda por ID — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { id } = req.params;
        const comanda = await Comanda.findByPk(id, {
            include: [
                { model: Mesa, attributes: ['id_mesa', 'numero_mesa', 'estado'] },
                {
                    model: DetalleComanda,
                    include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
                }
            ]
        });

        if (!comanda) {
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }

        res.json(comanda);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar comanda (estado u otros campos) — admin y employee
router.put('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { id_mesa, estado, productos } = req.body;

        const comanda = await Comanda.findByPk(id, { transaction: t });
        if (!comanda) {
            await t.rollback();
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }

        const estadoAnterior = comanda.estado;

        await comanda.update(
            { id_mesa: id_mesa ?? comanda.id_mesa, estado: estado ?? comanda.estado },
            { transaction: t }
        );

        // Al cancelar, devolver stock de todos los items
        if (estado === 'Cancelado' && estadoAnterior !== 'Cancelado') {
            const detalles = await DetalleComanda.findAll({ where: { id_comanda: id }, transaction: t });
            for (const d of detalles) {
                const prod = await Product.findByPk(d.id_producto, { transaction: t });
                if (prod) {
                    await prod.update({ stock: (prod.stock ?? 0) + d.cantidad }, { transaction: t });
                }
            }
        }

        // Si se envían productos (y no se está cancelando), reemplazar detalles y ajustar stock
        if (productos && productos.length > 0 && estado !== 'Cancelado') {
            // Devolver stock de los productos anteriores
            const viejosDetalles = await DetalleComanda.findAll({ where: { id_comanda: id }, transaction: t });
            for (const d of viejosDetalles) {
                const prod = await Product.findByPk(d.id_producto, { transaction: t });
                if (prod) {
                    await prod.update({ stock: (prod.stock ?? 0) + d.cantidad }, { transaction: t });
                }
            }

            await DetalleComanda.destroy({ where: { id_comanda: id }, transaction: t });

            for (const p of productos) {
                const product = await Product.findByPk(p.id_producto, { transaction: t });
                if (!product) {
                    await t.rollback();
                    return res.status(404).json({ error: `Producto con id ${p.id_producto} no encontrado` });
                }

                const stockActual = product.stock ?? 0;
                if (stockActual < p.cantidad) {
                    await t.rollback();
                    return res.status(400).json({
                        error: `Stock insuficiente para "${product.name}". Disponible: ${stockActual}`
                    });
                }
                await product.update({ stock: stockActual - p.cantidad }, { transaction: t });

                const precio_unitario = parseFloat(product.price);
                const subtotal = precio_unitario * p.cantidad;

                await DetalleComanda.create({
                    id_comanda: id,
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                    precio_unitario,
                    subtotal
                }, { transaction: t });
            }
        }

        await t.commit();
        res.json({ message: 'Comanda actualizada correctamente' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
});

// Eliminar comanda y sus detalles — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const comanda = await Comanda.findByPk(id, { transaction: t });
        if (!comanda) {
            await t.rollback();
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }

        await DetalleComanda.destroy({ where: { id_comanda: id }, transaction: t });
        await comanda.destroy({ transaction: t });

        await t.commit();
        res.json({ message: 'Comanda eliminada correctamente' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
