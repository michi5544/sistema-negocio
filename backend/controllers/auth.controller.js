//CONTROLADOR LOGIN (paso 1 para generar el token JWT )
const User =  require('../models/users.model.js');
const bcrypt = require('bcryptjs'); //- Guarda la contraseña encriptada con bcrypt / tipo de token JWT para autenticacion y autorizacion de usuarios
const jwt = require('jsonwebtoken'); // algoritmo de encriptacion para generar el token
require('dotenv').config();

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body; //payload de la solicitud contiene los claims 

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

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};