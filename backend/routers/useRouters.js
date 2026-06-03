const express = require('express');

const router = express.Router();

const userController = require('../controllers/useController');

// CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// LOGIN
router.post('/login', userController.login);
module.exports = router;