const express = require('express');
const router = express.Router();
const SaleDetail = require('../models/sale_details.model.js');
const Product = require('../models/product.model.js');
const Sale = require('../models/sale.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear detalle de venta — admin y employee
router.post('/', authenticateToken, authorizeRole('admin', 'employee'), async (req , res) => {
    try{
        const { saleId, productId, quantity, price } = req.body;
        const detail = await SaleDetail.create({ saleId, productId, quantity, price });
        res.json(detail);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Listar detalles — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const details = await SaleDetail.findAll({
            include: [Sale, Product]
        });
        res.json(details);
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

// Actualizar detalle — admin y employee
router.put('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const {id} = req.params;
        await SaleDetail.update(req.body, {where: { id }});
        res.json({message: 'Detalle actualizado'});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Eliminar detalle — admin y employee
router.delete('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const { id } = req.params;
        await SaleDetail.destroy({ where: {id} });
        res.json({ message: 'Detalle eliminado'});
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;
