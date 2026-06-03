const express = require('express');

const router = express.Router();

const productController =
require('../controllers/productController');

// GET
router.get('/',
    productController.getProducts);

// POST
router.post('/',
    productController.createProduct);

// DELETE
router.delete('/:id',
    productController.deleteProduct);

// PUT
router.put('/:id',
    productController.updateProduct);

module.exports = router;