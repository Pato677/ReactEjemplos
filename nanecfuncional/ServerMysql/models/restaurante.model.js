const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

// Definición del modelo Restaurante
const Restaurante = sequelize.define('Restaurante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del restaurante es obligatorio'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección es obligatoria'
            },
            len: {
                args: [5, 200],
                msg: 'La dirección debe tener entre 5 y 200 caracteres'
            }
        }
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El tipo de restaurante es obligatorio'
            },
            len: {
                args: [2, 50],
                msg: 'El tipo debe tener entre 2 y 50 caracteres'
            }
        }
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: {
                msg: 'Debe ser una URL válida'
            }
        }
    },
    reputacion: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "1",
        validate: {
            notEmpty: {
                msg: 'La reputación es obligatoria'
            },
            isIn: {
                args: [["1", "2", "3", "4", "5"]],
                msg: 'La reputación debe ser un valor entre 1 y 5'
            }
        }
    }
}, {
    // Opciones del modelo
    tableName: 'restaurantes',
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    paranoid: false, // Si quieres soft deletes, cambia a true
    freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
    validate: {
        // Validaciones a nivel de modelo
        reputacionValid() {
            if (!["1", "2", "3", "4", "5"].includes(this.reputacion)) {
                throw new Error('La reputación debe ser un valor entre 1 y 5');
            }
        }
    }
});

// Métodos de clase (estáticos)
Restaurante.findByTipo = function(tipo) {
    return this.findAll({
        where: {
            tipo: tipo
        }
    });
};

Restaurante.findByReputacion = function(reputacion) {
    return this.findAll({
        where: {
            reputacion: reputacion
        },
        order: [['createdAt', 'DESC']]
    });
};

Restaurante.findBestRated = function(limit = 10) {
    return this.findAll({
        where: {
            reputacion: "5"
        },
        order: [['createdAt', 'DESC']],
        limit: limit
    });
};

module.exports = Restaurante;
