const express = require('express');
const router = express.Router();
const sequelize = require('../config/db.js')
const Sale = require('../models/sale.model.js');
const SaleDetail = require('../models/sale_details.model.js');
const Product = require('../models/product.model.js');
const Customers = require('../models/customers.model.js');
const { json } = require('sequelize');


// -------------- STORED PROCEDURED ----------------
// ruta que llama al SP
router.get('/sp', async (req, res) => {
    try{
        // Ejecutar el SP
        const results = await sequelize.query(
            'call sistema_negocio.Sp_listar_venta_con_detalle()'
        );

        res.json(results);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
});


//CREAR UNA VENTA CON DETALLES
router.post('/', async (req, res) => {
    try{
        const {customer_id, user_id ,products} = req.body;

        //CREAR LA TABLA
        const sale = await Sale.create({customer_id, user_id, total: 0});

        let total = 0;

        //INSERTAR DETALLES
        for(const p of products){
            const product = await Product.findByPk(p.productId);
            if(product){
                const subtotal = parseFloat(product.price) * p.quantity;
                total += subtotal;

                await SaleDetail.create({
                    sale_id: sale.id,
                    product_id: product.id,
                    quantity: p.quantity,
                    price: product.price
                });
            }
        }

        //ACTUALIZAR TOTAL DE LA VENTA
        sale.total = total;
        await sale.save();

        res.json({ message: 'Venta registrada', sale });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});


//Obtener una venta específica con cliente y productos
router.get('/:id', async(req, res) => {
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

// listar todas las ventas con cliente y productos
router.get('/', async (req, res) => {
    try{
        const sales = await Sale.findAll({
            include: [
                {
                    model: Customers, // incluye datos del cliente
                    attributes: ['id', 'name', 'email'] //selecciona campos relevantes
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

//eliminar una venta y sus detalles
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;

        //Buscar venta
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

        //Eliminar detalles de venta
        await SaleDetail.destroy({ where: { sale_id: id }});

        //Eliminar venta
        await Sale.destroy({ where: { id }});
        res.json({ message: 'Venta eliminada correctamente'});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
})

// Actualizar una venta y sus detalles
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction(); // 👈 iniciamos transacción
  try {
    const { id } = req.params;
    const { customer_id, user_id, products } = req.body;

    // Buscar la venta
    const sale = await Sale.findByPk(id, { transaction: t });
    if (!sale) {
      await t.rollback();
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Actualizar datos de la venta
    sale.customer_id = customer_id ?? sale.customer_id;
    sale.user_id = user_id ?? sale.user_id;
    sale.total = 0; // recalcularemos
    await sale.save({ transaction: t });

    // Eliminar detalles anteriores
    await SaleDetail.destroy({ where: { sale_id: id }, transaction: t });
    // Insertar nuevos detalles
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

    // Actualizar total
    sale.total = total;
    await sale.save({ transaction: t });

    await t.commit(); // 👈 confirmamos cambios

    res.json({ message: 'Venta actualizada correctamente', sale });
  } catch (err) {
    await t.rollback(); // 👈 revertimos si hay error
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;