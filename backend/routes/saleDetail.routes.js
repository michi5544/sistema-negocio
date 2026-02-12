const express = require('express');
const router = express.Router();
const SaleDetail = require('../models/sale_details.model.js');
const Product = require('../models/product.model.js');
const Sale = require('../models/sale.model.js');

//CREAR DETALLE DE VENTA
router.post('/', async (req , res) => {
    try{
        const { saleId, productId, quantity, price } = req.body;
        const detail = await SaleDetail.create({ saleId, productId, quantity, price });
        res.json(detail);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

//LISTAR DETALLES
router.get('/', async (req, res) => {
    try{
        const details = await SaleDetail.findAll({
            include: [Sale, Product]
        });
        res.json(details);
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

//ACTUALIZAR DETALLE
router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        await SaleDetail.update(req.body, {where: { id }});
        res.json({message: 'Detalle actualizado'});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

//ELIMINAR DETALLE
router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        await SaleDetail.destroy({ where: {id} });
        res.json({ message: 'Detalle eliminado'});
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;