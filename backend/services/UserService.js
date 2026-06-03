const User = require('../models/userModel');

class UserService {

    constructor() {}

    // Obtener todos
    async getAll() {

        return await User.findAll();

    }

    // Obtener por ID
    async filterById(id) {

        return await User.findByPk(id);

    }

    // Crear usuario
    async create(data) {

        return await User.create(data);

    }

    // Actualizar usuario
    async update(id, data) {

        await User.update(data, {
            where: { id }
        });

        return await this.filterById(id);

    }

    // Eliminar usuario
    async delete(id) {

        return await User.destroy({
            where: { id }
        });

    }

}

module.exports = UserService;