const express = require('express');
const router = express.Router();
const Customers = require('../models/customers.model.js');


//CREAR CLIENTE
router.post('/', async (req, res) => {
    try{
        const customers = await Customers.create(req.body);
        res.json(customers);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
    
//LISTAR CLIENTES
router.get('/', async(req, res) => {
    try{
        const customers = await Customers.findAll();
        res.json(customers);
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

// OBTENER UN CLIENTE POR ID
router.get('/:id', async (req, res) => {
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

// OBTENER UN CLIENTE POR OTRO CAMPO
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Customers.findOne({
            where: { id },
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


//ACTUALIZAR CLIENTE
router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;

        // Actualizar con los datos que vienen en body
        const [updated] = await Customers.update(req.body, {
            where: { id }
        });

        if (updated === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Obtener el cliente actualizado para devolverlo
        const clienteActualizado = await Customers.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone'] // 
        });

        res.json({ message: 'Cliente actualizado correctamente', cliente: clienteActualizado });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//ELIMINAR CLIENTE
router.delete('/:id', async (req, res) => {
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