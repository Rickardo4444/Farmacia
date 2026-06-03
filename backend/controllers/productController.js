const Product =
    require('../models/productModel');

// OBTENER PRODUCTOS
exports.getProducts = async (req, res) => {

    try {

        const products =
            await Product.findAll();

        res.status(200).json({

            success: true,

            data: products

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// CREAR PRODUCTO
exports.createProduct = async (req, res) => {

    try {

        const {

            nombre,
            categoria,
            precio,
            stock,
            proveedor,
            lote

        } = req.body;

        const product =
            await Product.create({

                nombre,
                categoria,
                precio,
                stock,
                proveedor,
                lote

            });

        res.status(201).json({

            success: true,

            message: 'Producto creado',

            data: product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ELIMINAR
exports.deleteProduct = async (req, res) => {

    try {

        const id = req.params.id;

        await Product.destroy({

            where: { id }

        });

        res.status(200).json({

            success: true,

            message: 'Producto eliminado'

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ACTUALIZAR
exports.updateProduct = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            nombre,
            categoria,
            precio,
            stock,
            proveedor,
            lote

        } = req.body;

        await Product.update({

            nombre,
            categoria,
            precio,
            stock,
            proveedor,
            lote

        }, {

            where: { id }

        });

        res.status(200).json({

            success: true,

            message: 'Producto actualizado'

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};