const express = require('express');
const router = express.Router();
const Mesa = require('../models/mesa.model.js');
const Users = require('../models/users.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Obtener todas las mesas — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const mesas = await Mesa.findAll({
            attributes: ['id_mesa', 'numero_mesa', 'cantidad_personas', 'estado', 'comentarios', 'tiempo_ocupada', 'id_usuario', 'id_ambiente'],
            include: [
                { model: Users, attributes: ['id', 'name', 'email', 'role'] }
            ]
        });
        res.json(mesas);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Obtener una mesa por ID — admin y employee
router.get('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const {id} = req.params;
        const mesa = await Mesa.findByPk(id, {
            attributes: ['id_mesa', 'numero_mesa', 'cantidad_personas', 'estado', 'comentarios', 'tiempo_ocupada', 'id_usuario', 'id_ambiente'],
            include: [
                { model: Users, attributes: ['id', 'name', 'email', 'role'] }
            ]
        });
        if(mesa){
            res.json(mesa);
        }else{
            res.status(404).json({ error: 'Mesa no encontrada' });
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva mesa — solo admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {numero_mesa, cantidad_personas, estado, comentarios, tiempo_ocupada, id_usuario, id_ambiente} = req.body;
        const nuevaMesa = await Mesa.create({
            numero_mesa,
            cantidad_personas,
            estado,
            comentarios,
            tiempo_ocupada,
            id_usuario,
            id_ambiente
        });
        res.status(201).json(nuevaMesa);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una mesa — admin y employee
router.put('/:id', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const {id} = req.params;
        const {numero_mesa, cantidad_personas, estado, comentarios, tiempo_ocupada, id_usuario, id_ambiente} = req.body;
        const mesa = await Mesa.findByPk(id);
        if(mesa){
            await mesa.update({
                numero_mesa,
                cantidad_personas,
                estado,
                comentarios,
                tiempo_ocupada,
                id_usuario,
                id_ambiente
            });
            res.json(mesa);
        }else{
            res.status(404).json({ error: 'Mesa no encontrada' });
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una mesa — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {id} = req.params;
        const mesa = await Mesa.findByPk(id);
        if(mesa){
            await mesa.destroy();
            res.json({ message: 'Mesa eliminada correctamente' });
        }else{
            res.status(404).json({ error: 'Mesa no encontrada' });
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
