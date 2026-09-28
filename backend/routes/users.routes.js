const express = require('express');
const router = express.Router();
const Users = require('../models/users.model.js');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middlewares/auth.middleware.js');
const authorizeRole = require('../middlewares/authorizeRole.js');

// Crear usuario — solo admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const users = await Users.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee'
        });

        res.json(users);
    }catch(err){
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ errors: err.errors.map(e => e.message) });
        }
        res.status(500).json({ error: err.message });
    }
});

// Listar usuarios — solo admin
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const users = await Users.findAll();
        res.json(users);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Obtener usuario por ID — solo admin
router.get('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Users.findByPk(id, {
            attributes: ['id', 'name', 'email', 'role', 'created_at']
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar usuario — solo admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {id} = req.params;
        const { password, ...rest } = req.body;

        const updateData = { ...rest };
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await Users.update(updateData, {where: {id}});
        res.json({message: 'Usuario actualizado'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Eliminar usuario — solo admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try{
        const {id} = req.params;
        await Users.destroy({where: {id}});
        res.json({message: 'Usuario eliminado'});
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
