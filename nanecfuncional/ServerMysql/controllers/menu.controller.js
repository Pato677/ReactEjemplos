const Menu = require('../models/menu.model');
const Restaurante = require('../models/restaurante.model');
const TipoComida = require('../models/tipocomida.model');

// Crear una nueva relación entre restaurante y tipo de comida
module.exports.createMenu = async (request, response) => {
    const { restauranteId, tipoComidaId } = request.body;
    try {
        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findByPk(restauranteId);
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }

        // Verificar que el tipo de comida existe
        const tipoComida = await TipoComida.findByPk(tipoComidaId);
        if (!tipoComida) {
            return response.status(404).json({
                message: 'Tipo de comida no encontrado'
            });
        }

        // Verificar si la relación ya existe
        const existeRelacion = await Menu.findOne({
            where: {
                RestauranteId: restauranteId,
                TipoComidaId: tipoComidaId
            }
        });

        if (existeRelacion) {
            return response.status(409).json({
                message: 'La relación entre este restaurante y tipo de comida ya existe'
            });
        }

        // Crear la nueva relación
        const menu = await Menu.create({
            RestauranteId: restauranteId,
            TipoComidaId: tipoComidaId
        });

        response.status(201).json({
            message: 'Relación creada exitosamente',
            data: menu
        });
    } catch (err) {
        response.status(500).json({
            message: 'No se pudo crear la relación',
            error: err.message
        });
    }
};

// Obtener todas las relaciones menu
module.exports.getAllMenus = async (_, response) => {
    console.log('🍽️ Petición recibida para obtener todas las relaciones menu');
    try {
        const menus = await Menu.findAll({
            include: [
                {
                    model: Restaurante,
                    attributes: ['id', 'nombre', 'direccion', 'tipo', 'reputacion']
                },
                {
                    model: TipoComida,
                    attributes: ['id', 'nombre', 'paisOrigen']
                }
            ],
            order: [['fechaCreacion', 'DESC']]
        });
        
        console.log('📊 Relaciones encontradas:', menus.length);
        
        response.json({
            message: 'Relaciones menu obtenidas exitosamente',
            count: menus.length,
            data: menus
        });
    } catch (err) {
        console.error('❌ Error al obtener relaciones menu:', err);
        response.status(500).json({
            message: 'Error al obtener las relaciones menu',
            error: err.message
        });
    }
};

// Obtener una relación específica por ID
module.exports.getMenu = async (request, response) => {
    try {
        const menu = await Menu.findOne({
            where: { id: request.params.id },
            include: [
                {
                    model: Restaurante,
                    attributes: ['id', 'nombre', 'direccion', 'tipo', 'reputacion']
                },
                {
                    model: TipoComida,
                    attributes: ['id', 'nombre', 'paisOrigen']
                }
            ]
        });
        
        if (!menu) {
            return response.status(404).json({
                message: 'Relación menu no encontrada'
            });
        }
        
        response.json({
            message: 'Relación menu encontrada',
            data: menu
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener la relación menu',
            error: err.message
        });
    }
};

// Eliminar una relación menu
module.exports.deleteMenu = async (request, response) => {
    try {
        const menu = await Menu.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!menu) {
            return response.status(404).json({
                message: 'Relación menu no encontrada'
            });
        }

        await menu.destroy();
        
        response.json({
            message: 'Relación menu eliminada exitosamente'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al eliminar la relación menu',
            error: err.message
        });
    }
};

// Obtener tipos de comida de un restaurante específico
module.exports.getTiposComidaByRestaurante = async (request, response) => {
    try {
        const { restauranteId } = request.params;
        
        const restaurante = await Restaurante.findByPk(restauranteId, {
            include: [
                {
                    model: TipoComida,
                    attributes: ['id', 'nombre', 'paisOrigen'],
                    through: {
                        attributes: ['id', 'fechaCreacion']
                    }
                }
            ]
        });
        
        if (!restaurante) {
            return response.status(404).json({
                message: 'Restaurante no encontrado'
            });
        }
        
        response.json({
            message: `Tipos de comida del restaurante "${restaurante.nombre}" obtenidos exitosamente`,
            restaurante: {
                id: restaurante.id,
                nombre: restaurante.nombre,
                direccion: restaurante.direccion
            },
            tiposComida: restaurante.TipoComidas,
            count: restaurante.TipoComidas.length
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener tipos de comida del restaurante',
            error: err.message
        });
    }
};

// Obtener restaurantes que sirven un tipo de comida específico
module.exports.getRestaurantesByTipoComida = async (request, response) => {
    try {
        const { tipoComidaId } = request.params;
        
        const tipoComida = await TipoComida.findByPk(tipoComidaId, {
            include: [
                {
                    model: Restaurante,
                    attributes: ['id', 'nombre', 'direccion', 'tipo', 'reputacion'],
                    through: {
                        attributes: ['id', 'fechaCreacion']
                    }
                }
            ]
        });
        
        if (!tipoComida) {
            return response.status(404).json({
                message: 'Tipo de comida no encontrado'
            });
        }
        
        response.json({
            message: `Restaurantes que sirven "${tipoComida.nombre}" obtenidos exitosamente`,
            tipoComida: {
                id: tipoComida.id,
                nombre: tipoComida.nombre,
                paisOrigen: tipoComida.paisOrigen
            },
            restaurantes: tipoComida.Restaurantes,
            count: tipoComida.Restaurantes.length
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener restaurantes por tipo de comida',
            error: err.message
        });
    }
};

// Verificar si existe una relación específica
module.exports.verificarRelacion = async (request, response) => {
    try {
        const { restauranteId, tipoComidaId } = request.params;
        
        const relacion = await Menu.findOne({
            where: {
                RestauranteId: restauranteId,
                TipoComidaId: tipoComidaId
            },
            include: [
                {
                    model: Restaurante,
                    attributes: ['id', 'nombre']
                },
                {
                    model: TipoComida,
                    attributes: ['id', 'nombre']
                }
            ]
        });
        
        if (!relacion) {
            return response.status(404).json({
                message: 'No existe relación entre este restaurante y tipo de comida',
                existe: false
            });
        }
        
        response.json({
            message: 'Relación encontrada',
            existe: true,
            data: relacion
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al verificar la relación',
            error: err.message
        });
    }
};

// Eliminar relación específica por restaurante y tipo de comida
module.exports.eliminarRelacionEspecifica = async (request, response) => {
    try {
        const { restauranteId, tipoComidaId } = request.params;
        
        const relacion = await Menu.findOne({
            where: {
                RestauranteId: restauranteId,
                TipoComidaId: tipoComidaId
            }
        });
        
        if (!relacion) {
            return response.status(404).json({
                message: 'No existe relación entre este restaurante y tipo de comida'
            });
        }
        
        await relacion.destroy();
        
        response.json({
            message: 'Relación eliminada exitosamente'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al eliminar la relación',
            error: err.message
        });
    }
};
