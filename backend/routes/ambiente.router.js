const express = require('express');
const router = express.Router();
const sequelize = require('../config/db.js');
const Ambiente = require('../models/ambiente.model.js');
const { json } = require('sequelize');

//OBTENER TODOS LOS AMBIENTES
router.get('/', async (req, res) => {
    try{
        const ambientes = await Ambiente.findAll({
                    attributes: ['id_ambiente','codigo' ,'nombre', 'descripcion']
        });  
        res.json(ambientes);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try{
        const {codigo,nombre, descripcion} = req.body;
        const nuevoAmbiente = await Ambiente.create({
            codigo,
            nombre,
            descripcion
        });
        res.status(201).json(nuevoAmbiente);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => { 
    try{
        const {id} = req.params;
        const ambiente = await Ambiente.findByPk(id);
        if(ambiente){
            await ambiente.destroy();
            res.json({ message: 'Ambiente eliminado correctamente' });
        }else{
            res.status(404).json({ error: 'Ambiente no encontrado' });
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;