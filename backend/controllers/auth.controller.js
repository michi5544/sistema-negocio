//CONTROLADOR LOGIN
const User =  require('../models/users.model.js');
const bcrypt = require('bcryptjs'); //- Guarda la contraseña encriptada con bcrypt
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ where: {email }});
        if(!user){
            return res.status(404).json({ error: 'Usuario no encontrado'});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(401).json({ error: 'contraseña incorrecta'});
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h'} // Expiracion de token
        );

        res.json({ message: 'Login exitoso', token });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};