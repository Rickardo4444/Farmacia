const express = require('express');

const router = express.Router();

const pacientesController =
    require('../controllers/pacienteController');
// GET
router.get('/',
    pacientesController.getPacientes);
// POST
router.post('/',
    pacientesController.createPaciente);
// DELETE
router.delete('/:id',
    pacientesController.deletePaciente);
// PUT
router.put('/:id',
    pacientesController.updatePaciente);
module.exports = router;