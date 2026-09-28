// Middleware para validar token, verifique el rol del usuario
// Acepta uno o varios roles: authorizeRole('admin') o authorizeRole('admin', 'employee')

function authorizeRole(...roles){
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ error: 'Acceso denegado: no tienes permisos suficientes'});
        }
        next();
    };
}

module.exports = authorizeRole;