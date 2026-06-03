const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: 'No se proporcionó token de autenticación'
        });
    }

    try {
        const token = authorization.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : authorization;

        const decoded = jwt.verify(token, 'secreto_super_seguro');

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token de autenticación inválido'
        });
    }
};