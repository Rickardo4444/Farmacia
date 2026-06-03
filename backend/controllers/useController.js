const UserService = require('../services/UserService');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userService = new UserService();

// Obtener todos
exports.getAllUsers = async (req, res) => {

    try {
        const users = await userService.getAll();
        res.status(200).json({
            message: 'Usuarios obtenidos exitosamente',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

// Obtener uno
exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.filterById(id);
        if (user) {
            res.status(200).json({
                message: 'Usuario obtenido exitosamente',
                data: user
            });
        } else {
            res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener usuario',
            message: error.message
        });
    }
};

// Crear usuario
exports.createUser = async (req, res) => {
    try {
        const {name,email,password,role} = req.body;
        // VALIDAR CAMPOS
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Completa todos los campos'
            });
        }
        // VERIFICAR EMAIL
        const existingUser = await User.findOne({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya existe'
            });
        }
        // CIFRAR PASSWORD
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // CREAR USUARIO
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        res.status(201).json({

            success: true,
            message: 'Usuario creado',
            data: newUser
        });
    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message
        });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {

    try {
        const id = req.params.id;
        const data = req.body;
        const user = await userService.filterById(id);
        if (user) {
            // SI VIENE PASSWORD -> CIFRARLA
            if (data.password) {
                data.password = await bcrypt.hash(
                    data.password,
                    10
                );
            }
            await userService.update(id, data);
            res.status(200).json({
                success: true,
                message: 'Usuario actualizado exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al actualizar usuario',
            message: error.message
        });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {

    try {
        const id = req.params.id;
        const user = await userService.filterById(id);
        if (user) {
            await userService.delete(id);
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

    } catch (error) {

        res.status(500).json({
            error: 'Error al eliminar usuario',
            message: error.message
        });
    }
};

// LOGIN
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        // Buscar usuario
        const user = await User.findOne({
            where: { email }
        });
        // Validar usuario
        if (!user) {

            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Comparar password
        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );
        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });

        }

        // Crear token
        const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        'secreto_super_seguro',
        {
            expiresIn: '1d'
        }
        );

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};