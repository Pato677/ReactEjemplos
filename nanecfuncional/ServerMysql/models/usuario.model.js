const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

// Definición del modelo Usuario
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El nombre de usuario es obligatorio'
            },
            len: {
                args: [3, 50],
                msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
            },
            isAlphanumeric: {
                msg: 'El nombre de usuario solo puede contener letras y números'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El email es obligatorio'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            },
            len: {
                args: [5, 100],
                msg: 'El email debe tener entre 5 y 100 caracteres'
            }
        }
    }
}, {
    // Opciones del modelo
    tableName: 'usuarios',
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    paranoid: false, // Si quieres soft deletes, cambia a true
    freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['username']
        },
        {
            unique: true,
            fields: ['email']
        }
    ]
});

// Métodos de clase (estáticos)
Usuario.findByUsername = function(username) {
    return this.findOne({
        where: {
            username: username
        }
    });
};

Usuario.findByEmail = function(email) {
    return this.findOne({
        where: {
            email: email
        }
    });
};

Usuario.getAllOrderedByUsername = function() {
    return this.findAll({
        order: [['username', 'ASC']]
    });
};

Usuario.getAllOrderedByCreation = function() {
    return this.findAll({
        order: [['createdAt', 'DESC']]
    });
};

module.exports = Usuario;
