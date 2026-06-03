const Paciente = require('../models/pacienteModel');

// OBTENER PACIENTES
exports.getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();

        res.status(200).json({
            success: true,
            data: pacientes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREAR PACIENTE
exports.createPaciente = async (req, res) => {
    try {
        const {
            nombre,
            edad,
            especialidad
        } = req.body;

        const paciente = await Paciente.create({
            nombre,
            edad,
            especialidad
        });

        res.status(201).json({
            success: true,
            message: 'Paciente creado',
            data: paciente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ELIMINAR PACIENTE
exports.deletePaciente = async (req, res) => {
    try {
        const id = req.params.id;

        await Paciente.destroy({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Paciente eliminado'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ACTUALIZAR PACIENTE
exports.updatePaciente = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            nombre,
            edad,
            especialidad
        } = req.body;

        await Paciente.update(
            {
                nombre,
                edad,
                especialidad
            },
            {
                where: { id }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Paciente actualizado'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};