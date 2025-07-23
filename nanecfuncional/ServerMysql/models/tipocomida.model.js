const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

// Definición del modelo TipoComida
const TipoComida = sequelize.define('TipoComida', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El nombre del tipo de comida es obligatorio'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    paisOrigen: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El país de origen es obligatorio'
            },
            len: {
                args: [2, 100],
                msg: 'El país de origen debe tener entre 2 y 100 caracteres'
            },
            isAlpha: {
                msg: 'El país de origen solo debe contener letras y espacios'
            }
        }
    }
}, {
    // Opciones del modelo
    tableName: 'tipos_comida',
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    paranoid: false, // Si quieres soft deletes, cambia a true
    freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['nombre']
        },
        {
            fields: ['paisOrigen']
        }
    ]
});

// Métodos de clase (estáticos)
TipoComida.findByPaisOrigen = function(pais) {
    return this.findAll({
        where: {
            paisOrigen: pais
        },
        order: [['nombre', 'ASC']]
    });
};

TipoComida.findByNombre = function(nombre) {
    return this.findOne({
        where: {
            nombre: nombre
        }
    });
};

TipoComida.getAllOrderedByName = function() {
    return this.findAll({
        order: [['nombre', 'ASC']]
    });
};

TipoComida.getAllOrderedByCountry = function() {
    return this.findAll({
        order: [['paisOrigen', 'ASC'], ['nombre', 'ASC']]
    });
};

module.exports = TipoComida;
