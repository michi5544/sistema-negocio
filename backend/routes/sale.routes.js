const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/db.js')
const Sale = require('../models/sale.model.js');
const SaleDetail = require('../models/sale_details.model.js');
const Product = require('../models/product.model.js');
const Customers = require('../models/customers.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Stored procedure — admin y employee
router.get('/sp', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const results = await sequelize.query(
            'call sistema_negocio.Sp_listar_venta_con_detalle()'
        );
        res.json(results);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
});

// Crear una venta con detalles — admin y employee
router.post('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const { customer_id, user_id, products, id_mesa, id_comanda } = req.body;

        // Si no viene customer_id (modo POS), usar o crear "Consumidor Final"
        let efectivoCustomerId = customer_id || null;
        if (!efectivoCustomerId) {
            const [cf] = await Customers.findOrCreate({
                where: { name: 'Consumidor Final' },
                defaults: { email: null, phone: null, address: null }
            });
            efectivoCustomerId = cf.id;
        }

        const sale = await Sale.create({
            customer_id: efectivoCustomerId,
            user_id,
            total: 0,
            id_mesa: id_mesa || null
        }, { transaction: t });

        let total = 0;

        for(const p of products){
            const product = await Product.findByPk(p.productId, { transaction: t });
            if (!product) {
                await t.rollback();
                return res.status(404).json({ error: `Producto ${p.productId} no encontrado` });
            }

            // Solo descontar stock en ventas directas (POS / sin mesa)
            // Las ventas desde comanda no descontan — la comanda ya lo hizo al crearse
            if (!id_comanda) {
                const stockActual = product.stock ?? 0;
                if (stockActual < p.quantity) {
                    await t.rollback();
                    return res.status(400).json({
                        error: `Stock insuficiente para "${product.name}". Disponible: ${stockActual}`
                    });
                }
                await product.update({ stock: stockActual - p.quantity }, { transaction: t });
            }

            const subtotal = parseFloat(product.price) * p.quantity;
            total += subtotal;

            await SaleDetail.create({
                sale_id: sale.id,
                product_id: product.id,
                quantity: p.quantity,
                price: product.price
            }, { transaction: t });
        }

        sale.total = total;
        await sale.save({ transaction: t });
        await t.commit();

        const today = new Date().toISOString().split('T')[0];
        res.json({ message: 'Venta registrada', sale: { ...sale.toJSON(), sale_date: today } });
    }catch(err){
        await t.rollback();
        console.error('[POST /api/sales] Error:', err.message);
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

// Obtener una venta específica con cliente y productos — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async(req, res) => {
    try{
        const {id} = req.params;
        const sale = await Sale.findByPk(id, {
            include: [
                {
                    model: Customers,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: SaleDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price']
                        }
                    ]
                }
            ]
        });

        if(!sale){
            return res.status(404).json({ error: 'Venta no encontrada'});
        }

        res.json(sale);

    } catch(err){
        res.status(500).json({ error: err.message});
    }
});

// Listar todas las ventas con cliente y productos — admin y employee
// Soporta filtro: GET /api/sales?desde=2024-01-01&hasta=2024-12-31
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const { desde, hasta } = req.query;
        const where = {};

        // Acepta tanto "YYYY-MM-DD" como timestamps ISO completos
        const parseFecha = (str, tipo) => {
            if (!str) return null;
            if (str.includes('T')) return new Date(str);
            return tipo === 'inicio' ? new Date(str + 'T00:00:00') : new Date(str + 'T23:59:59');
        };
        const desdeDate = parseFecha(desde, 'inicio');
        const hastaDate = parseFecha(hasta, 'fin');

        if (desdeDate && hastaDate) {
            where.sale_date = { [Op.between]: [desdeDate, hastaDate] };
        } else if (desdeDate) {
            where.sale_date = { [Op.gte]: desdeDate };
        } else if (hastaDate) {
            where.sale_date = { [Op.lte]: hastaDate };
        }

        const sales = await Sale.findAll({
            where,
            order: [['sale_date', 'DESC']],
            include: [
                {
                    model: Customers,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: SaleDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price']
                        }
                    ]
                }
            ]
        });

        res.json(sales);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una venta y sus detalles — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {id} = req.params;

        const sale = await Sale.findByPk(id, {
            include: [
                {
                    model: SaleDetail,
                    include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
                },
                {
                    model: Customers,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if(!sale){
            return res.status(404).json({ error: 'Venta no encontrada'});
        }

        await SaleDetail.destroy({ where: { sale_id: id }});
        await Sale.destroy({ where: { id }});
        res.json({ message: 'Venta eliminada correctamente'});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una venta y sus detalles — solo admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { customer_id, user_id, products } = req.body;

    const sale = await Sale.findByPk(id, { transaction: t });
    if (!sale) {
      await t.rollback();
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    sale.customer_id = customer_id ?? sale.customer_id;
    sale.user_id = user_id ?? sale.user_id;
    sale.total = 0;
    await sale.save({ transaction: t });

    await SaleDetail.destroy({ where: { sale_id: id }, transaction: t });

    let total = 0;
    for (const p of products) {
      const product = await Product.findByPk(p.productId, { transaction: t });
      if (product) {
        const subtotal = parseFloat(product.price) * p.quantity;
        total += subtotal;

        await SaleDetail.create({
          sale_id: sale.id,
          product_id: product.id,
          quantity: p.quantity,
          price: product.price
        }, { transaction: t });
      }
    }

    sale.total = total;
    await sale.save({ transaction: t });

    await t.commit();

    res.json({ message: 'Venta actualizada correctamente', sale });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
