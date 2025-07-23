const Restaurante = require('../models/restaurante.model');

// Crear un nuevo restaurante
module.exports.createRestaurante = async (request, response) => {
    const { nombre, direccion, tipo, url, reputacion } = request.body;
    try {
        const restaurante = await Restaurante.create({ 
            nombre, 
            direccion, 
            tipo, 
            url,
            reputacion: reputacion || "1"
        });
        response.status(201).json({
            message: 'Restaurante creado exitosamente',
            data: restaurante
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else {
            response.status(500).json({
                message: 'No se pudo crear el restaurante',
                error: err.message
            });
        }
    }
};

// Obtener todos los restaurantes
module.exports.getAllRestaurantes = async (_, response) => {
    console.log('🍽️ Petición recibida para obtener todos los restaurantes');
    try {
        const restaurantes = await Restaurante.findAll({
            order: [['createdAt', 'DESC']] // Ordenar por fecha de creación, más recientes primero
        });
        
        console.log('📊 Restaurantes encontrados:', restaurantes.length);
        console.log('🎯 Primer restaurante:', restaurantes[0] ? restaurantes[0].nombre : 'Ninguno');
        
        const responseData = {
            message: 'Restaurantes obtenidos exitosamente',
            count: restaurantes.length,
            data: restaurantes
        };
        
        console.log('📡 Enviando respuesta:', responseData);
        response.json(responseData);
    } catch (err) {
        console.error('❌ Error al obtener restaurantes:', err);
        response.status(500).json({
            message: 'Error al obtener los restaurantes',
            error: err.message
        });
    }
};

// Obtener un restaurante por ID
module.exports.getRestaurante = async (request, response) => {
    try {
        const restaurante = await Restaurante.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }
        
        response.json({
            message: 'Restaurante encontrado',
            data: restaurante
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener el restaurante',
            error: err.message
        });
    }
};

// Actualizar un restaurante
module.exports.updateRestaurante = async (request, response) => {
    const { nombre, direccion, tipo, url, reputacion } = request.body;
    try {
        const restaurante = await Restaurante.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }

        await restaurante.update({
            nombre: nombre || restaurante.nombre,
            direccion: direccion || restaurante.direccion,
            tipo: tipo || restaurante.tipo,
            url: url || restaurante.url,
            reputacion: reputacion || restaurante.reputacion
        });

        response.json({
            message: 'Restaurante actualizado exitosamente',
            data: restaurante
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else {
            response.status(500).json({
                message: 'Error al actualizar el restaurante',
                error: err.message
            });
        }
    }
};

// Eliminar un restaurante
module.exports.deleteRestaurante = async (request, response) => {
    try {
        const restaurante = await Restaurante.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }

        await restaurante.destroy();
        
        response.json({
            message: 'Restaurante eliminado exitosamente'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al eliminar el restaurante',
            error: err.message
        });
    }
};

// Actualizar reputación de un restaurante
module.exports.updateReputacion = async (request, response) => {
    const { reputacion } = request.body;
    try {
        const restaurante = await Restaurante.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }

        if (!["1", "2", "3", "4", "5"].includes(reputacion)) {
            return response.status(400).json({
                message: 'La reputación debe ser un valor entre 1 y 5'
            });
        }

        await restaurante.update({ reputacion });
        
        response.json({
            message: 'Reputación actualizada exitosamente',
            data: restaurante
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al actualizar la reputación',
            error: err.message
        });
    }
};

// Obtener restaurantes por tipo
module.exports.getRestaurantesByTipo = async (request, response) => {
    try {
        const { tipo } = request.params;
        const restaurantes = await Restaurante.findByTipo(tipo);
        
        response.json({
            message: `Restaurantes de tipo "${tipo}" obtenidos exitosamente`,
            count: restaurantes.length,
            data: restaurantes
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener restaurantes por tipo',
            error: err.message
        });
    }
};

// Obtener restaurantes por reputación
module.exports.getRestaurantesByReputacion = async (request, response) => {
    try {
        const { reputacion } = request.params;
        
        if (!["1", "2", "3", "4", "5"].includes(reputacion)) {
            return response.status(400).json({
                message: 'La reputación debe ser un valor entre 1 y 5'
            });
        }
        
        const restaurantes = await Restaurante.findByReputacion(reputacion);
        
        response.json({
            message: `Restaurantes con reputación "${reputacion}" obtenidos exitosamente`,
            count: restaurantes.length,
            data: restaurantes
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener restaurantes por reputación',
            error: err.message
        });
    }
};

// Obtener restaurantes mejor calificados (reputación 5)
module.exports.getBestRatedRestaurantes = async (request, response) => {
    try {
        const limit = parseInt(request.query.limit) || 10;
        const restaurantes = await Restaurante.findBestRated(limit);
        
        response.json({
            message: 'Restaurantes mejor calificados obtenidos exitosamente',
            count: restaurantes.length,
            data: restaurantes
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener restaurantes mejor calificados',
            error: err.message
        });
    }
};
