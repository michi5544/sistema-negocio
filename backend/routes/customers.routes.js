const express = require('express');
const router = express.Router();
const Customers = require('../models/customers.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear cliente — solo admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const customers = await Customers.create(req.body);
        res.json(customers);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Listar clientes — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async(req, res) => {
    try{
        const customers = await Customers.findAll();
        res.json(customers);
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

// Obtener un cliente por ID — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Customers.findByPk(id, {
           attributes: ['id', 'name', 'email', 'phone', 'address']
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: 'Cliente no encontrado'})
    }
});

// Actualizar cliente — solo admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {id} = req.params;

        const [updated] = await Customers.update(req.body, {
            where: { id }
        });

        if (updated === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        const clienteActualizado = await Customers.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone']
        });

        res.json({ message: 'Cliente actualizado correctamente', cliente: clienteActualizado });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Eliminar cliente — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const { id } = req.params;

        const deleted = await Customers.destroy({
            where: {id}
        });

        if(deleted === 0){
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({message: 'Cliente eliminado'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
