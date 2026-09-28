const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Caja = require('../models/caja.model.js');
const Sale = require('../models/sale.model.js');
const User = require('../models/users.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Caja abierta actualmente (o null)
router.get('/actual', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const caja = await Caja.findOne({
            where: { estado: 'Abierta' },
            include: [{ model: User, as: 'UsuarioApertura', attributes: ['id', 'name'] }]
        });
        res.json({ caja: caja || null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Abrir caja
router.post('/abrir', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const existe = await Caja.findOne({ where: { estado: 'Abierta' } });
        if (existe) return res.status(400).json({ error: 'Ya hay una caja abierta' });

        const { monto_inicial } = req.body;
        if (monto_inicial === undefined || monto_inicial === null) {
            return res.status(400).json({ error: 'El monto inicial es requerido' });
        }

        const caja = await Caja.create({
            id_usuario_apertura: req.user.id,
            monto_inicial: parseFloat(monto_inicial),
            estado: 'Abierta'
        });
        res.status(201).json({ message: 'Caja abierta', caja });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cerrar caja
router.post('/cerrar', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const caja = await Caja.findOne({ where: { estado: 'Abierta' } });
        if (!caja) return res.status(400).json({ error: 'No hay caja abierta' });

        const { monto_final } = req.body;
        if (monto_final === undefined || monto_final === null) {
            return res.status(400).json({ error: 'El monto final es requerido' });
        }

        const ventas = await Sale.findAll({
            where: { sale_date: { [Op.gte]: caja.fecha_apertura } },
            attributes: ['total']
        });
        const total_ventas = ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const diferencia = parseFloat(monto_final) - (parseFloat(caja.monto_inicial) + total_ventas);

        await caja.update({
            id_usuario_cierre: req.user.id,
            fecha_cierre: new Date(),
            monto_final: parseFloat(monto_final),
            total_ventas,
            diferencia,
            estado: 'Cerrada'
        });

        res.json({ message: 'Caja cerrada exitosamente', caja });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Historial de cajas (solo admin)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const cajas = await Caja.findAll({
            include: [
                { model: User, as: 'UsuarioApertura', attributes: ['id', 'name'] },
                { model: User, as: 'UsuarioCierre', attributes: ['id', 'name'] }
            ],
            order: [['fecha_apertura', 'DESC']]
        });
        res.json(cajas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
