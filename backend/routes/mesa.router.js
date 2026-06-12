const express = require('express');
const router = express.Router();
const sequelize = require('../config/db.js');
const Mesa = require('../models/mesa.model.js');
const Users = require('../models/users.model.js');
const { json } = require('sequelize');

//OBTENER TODAS LAS MESAS
router.get('/', async (req, res) => {
    try{
        const mesas = await Mesa.findAll({
            attributes: ['id_mesa', 'numero_mesa', 'cantidad_personas', 'estado', 'comentarios', 'tiempo_ocupada', 'id_usuario', 'id_ambiente'],
            include: [
                {model: Users,
                attributes: ['id', 'name', 'email', 'role']}
            ]
        });
        res.json(mesas);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

//OBTENER UNA MESA POR ID
router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const mesa = await Mesa.findByPk(id, {
            attributes: ['id_mesa', 'numero_mesa', 'cantidad_personas', 'estado', 'comentarios', 'tiempo_ocupada', 'id_usuario', 'id_ambiente'],
            include: [
                {model: Users,
                attributes: ['id', 'name', 'email', 'role',]}
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

//CREAR UNA NUEVA MESA
router.post('/', async (req, res) => {
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

//ACTUALIZAR UNA NUEVA MESA
router.put('/:id', async (req, res) => {
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


//ELIMINAR UNA NUEVA MESA
router.delete('/:id', async (req, res) => {
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
