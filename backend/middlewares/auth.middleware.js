const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Bearer TOKEN

    if(!token){
        return res.status(401).json({ error: 'Token requerido'});
    }

        jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
            if(err) {
                return res.status(403).json({ error: 'Token invalido'});
            }
            req.user = user; //se guardan los datos del payload
            next();
        });
}

module.exports = authenticateToken;