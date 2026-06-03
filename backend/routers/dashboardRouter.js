const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/verifyToken');

router.get('/', verifyToken, (req, res) => {
    res.status(200).send('Bienvenido al dashboard ' + req.user.email);
});

module.exports = router;