// Middleware para validar token, verifique el rol del usuario

function authorizeRole(role){
    return (req, res, next) => {
        if(req.user.role !== role){   
            return res.status(403).json({ error: 'Acceso denegado: no tienes permisos suficientes'});
        }
        next();
    };
}

module.exports = authorizeRole;