const TipoComida = require('../models/tipocomida.model');

// Crear un nuevo tipo de comida
module.exports.createTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.create({ 
            nombre, 
            paisOrigen
        });
        response.status(201).json({
            message: 'Tipo de comida creado exitosamente',
            data: tipoComida
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            response.status(409).json({
                message: 'Error: Ya existe un tipo de comida con ese nombre',
                error: 'Nombre duplicado'
            });
        } else {
            response.status(500).json({
                message: 'No se pudo crear el tipo de comida',
                error: err.message
            });
        }
    }
};

// Obtener todos los tipos de comida
module.exports.getAllTiposComida = async (_, response) => {
    console.log('🍜 Petición recibida para obtener todos los tipos de comida');
    try {
        const tiposComida = await TipoComida.findAll({
            order: [['nombre', 'ASC']] // Ordenar alfabéticamente por nombre
        });
        
        console.log('📊 Tipos de comida encontrados:', tiposComida.length);
        console.log('🎯 Primer tipo:', tiposComida[0] ? tiposComida[0].nombre : 'Ninguno');
        
        const responseData = {
            message: 'Tipos de comida obtenidos exitosamente',
            count: tiposComida.length,
            data: tiposComida
        };
        
        console.log('📡 Enviando respuesta:', responseData);
        response.json(responseData);
    } catch (err) {
        console.error('❌ Error al obtener tipos de comida:', err);
        response.status(500).json({
            message: 'Error al obtener los tipos de comida',
            error: err.message
        });
    }
};

// Obtener un tipo de comida por ID
module.exports.getTipoComida = async (request, response) => {
    try {
        const tipoComida = await TipoComida.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!tipoComida) {
            return response.status(404).json({
                message: 'Tipo de comida no encontrado'
            });
        }
        
        response.json({
            message: 'Tipo de comida encontrado',
            data: tipoComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener el tipo de comida',
            error: err.message
        });
    }
};

// Actualizar un tipo de comida
module.exports.updateTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!tipoComida) {
            return response.status(404).json({
                message: 'Tipo de comida no encontrado'
            });
        }

        await tipoComida.update({
            nombre: nombre || tipoComida.nombre,
            paisOrigen: paisOrigen || tipoComida.paisOrigen
        });

        response.json({
            message: 'Tipo de comida actualizado exitosamente',
            data: tipoComida
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            response.status(409).json({
                message: 'Error: Ya existe un tipo de comida con ese nombre',
                error: 'Nombre duplicado'
            });
        } else {
            response.status(500).json({
                message: 'Error al actualizar el tipo de comida',
                error: err.message
            });
        }
    }
};

// Eliminar un tipo de comida
module.exports.deleteTipoComida = async (request, response) => {
    try {
        const tipoComida = await TipoComida.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!tipoComida) {
            return response.status(404).json({
                message: 'Tipo de comida no encontrado'
            });
        }

        await tipoComida.destroy();
        
        response.json({
            message: 'Tipo de comida eliminado exitosamente'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al eliminar el tipo de comida',
            error: err.message
        });
    }
};

// Obtener tipos de comida por país de origen
module.exports.getTiposComidaByPais = async (request, response) => {
    try {
        const { pais } = request.params;
        const tiposComida = await TipoComida.findByPaisOrigen(pais);
        
        response.json({
            message: `Tipos de comida de "${pais}" obtenidos exitosamente`,
            count: tiposComida.length,
            data: tiposComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener tipos de comida por país',
            error: err.message
        });
    }
};

// Buscar tipo de comida por nombre exacto
module.exports.getTipoComidaByNombre = async (request, response) => {
    try {
        const { nombre } = request.params;
        const tipoComida = await TipoComida.findByNombre(nombre);
        
        if (!tipoComida) {
            return response.status(404).json({
                message: `Tipo de comida "${nombre}" no encontrado`
            });
        }
        
        response.json({
            message: `Tipo de comida "${nombre}" encontrado`,
            data: tipoComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al buscar tipo de comida por nombre',
            error: err.message
        });
    }
};

// Obtener tipos de comida ordenados por nombre
module.exports.getTiposComidaOrderedByName = async (request, response) => {
    try {
        const tiposComida = await TipoComida.getAllOrderedByName();
        
        response.json({
            message: 'Tipos de comida ordenados por nombre obtenidos exitosamente',
            count: tiposComida.length,
            data: tiposComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener tipos de comida ordenados por nombre',
            error: err.message
        });
    }
};

// Obtener tipos de comida ordenados por país
module.exports.getTiposComidaOrderedByCountry = async (request, response) => {
    try {
        const tiposComida = await TipoComida.getAllOrderedByCountry();
        
        response.json({
            message: 'Tipos de comida ordenados por país obtenidos exitosamente',
            count: tiposComida.length,
            data: tiposComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener tipos de comida ordenados por país',
            error: err.message
        });
    }
};

// Buscar tipos de comida que contengan un texto en el nombre (búsqueda parcial)
module.exports.searchTiposComidaByName = async (request, response) => {
    try {
        const { search } = request.query;
        
        if (!search) {
            return response.status(400).json({
                message: 'Parámetro de búsqueda requerido'
            });
        }
        
        const tiposComida = await TipoComida.findAll({
            where: {
                nombre: {
                    [require('sequelize').Op.iLike]: `%${search}%`
                }
            },
            order: [['nombre', 'ASC']]
        });
        
        response.json({
            message: `Búsqueda de tipos de comida con "${search}" completada`,
            count: tiposComida.length,
            data: tiposComida
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error en la búsqueda de tipos de comida',
            error: err.message
        });
    }
};

// Obtener estadísticas de tipos de comida por país
module.exports.getEstadisticasByPais = async (request, response) => {
    try {
        const estadisticas = await TipoComida.findAll({
            attributes: [
                'paisOrigen',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cantidad']
            ],
            group: ['paisOrigen'],
            order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
        });
        
        response.json({
            message: 'Estadísticas por país obtenidas exitosamente',
            data: estadisticas
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener estadísticas por país',
            error: err.message
        });
    }
};
