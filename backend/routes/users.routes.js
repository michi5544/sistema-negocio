const express = require('express');
const router = express.Router();
const Users = require('../models/users.model.js');
const bcrypt = require('bcryptjs');

//  CREAR USUARIO
router.post('/', async (req, res) => {
    try{
        const { name, email, password, role } = req.body;
        
            if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

        //encriptar contraseña
        const hashedPassword = await bcrypt.hash( password, 10);

        const users = await Users.create({
            name, 
            email,
            password: hashedPassword // se guarda el hash
            ,role: role || 'Customer'
        });

        res.json(users);
    }catch(err){
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ errors: err.errors.map(e => e.message) });
  }
  res.status(500).json({ error: err.message });

    }
});

//LISTAR
router.get('/', async (req, res) => {
    try{
        const users = await Users.findAll();
        res.json(users);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});


//LISTAR USUARIOS POR ROL
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'created_at'] // selecciona solo lo necesario
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ACTUALIZAR
router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        await Users.update(req.body, {where: {id}});
        res.json({message: 'Usuario actualizado'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
try{
    const {id} = req.params;
    await Users.destroy(req.body, {where: {id}});
    res.json({message: 'Usuario eliminado'});
} catch(err){
        res.status(500).json({error: err.message});
}
});


module.exports = router;