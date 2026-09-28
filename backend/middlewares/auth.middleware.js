const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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