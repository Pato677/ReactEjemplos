const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Restaurante = require('./restaurante.model');
const TipoComida = require('./tipocomida.model');

const Menu = sequelize.define('Menu', {
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // fecha actual será el valor por default
        allowNull: false
    }
});

// Definición de relación muchos a muchos
Restaurante.belongsToMany(TipoComida, { through: Menu });
TipoComida.belongsToMany(Restaurante, { through: Menu });

// Definición de relaciones uno a muchos para cargar con `include` en el controlador
Menu.belongsTo(Restaurante, { foreignKey: 'RestauranteId' });
Menu.belongsTo(TipoComida, { foreignKey: 'TipoComidaId' });

module.exports = Menu;
