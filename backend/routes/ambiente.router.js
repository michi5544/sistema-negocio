const express = require('express');
const router = express.Router();
const Ambiente = require('../models/ambiente.model.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Obtener todos los ambientes — admin y employee
router.get('/', authenticateToken, authorizeRole('admin', 'employee'), async (req, res) => {
    try{
        const ambientes = await Ambiente.findAll({
            attributes: ['id_ambiente', 'codigo', 'nombre', 'descripcion']
        });
        res.json(ambientes);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Crear ambiente — solo admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {codigo, nombre, descripcion} = req.body;
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

// Eliminar ambiente — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
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
