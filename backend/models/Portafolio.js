const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');  // Relación con el modelo de usuario

const Portafolio = sequelize.define('Portafolio', {
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    criptomoneda: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad_invertida: {
        type: DataTypes.DECIMAL(18, 12),
        allowNull: false
    },
    precio_compra: {
        type: DataTypes.DECIMAL(18, 12),
        allowNull: false
    },
    fecha_inversion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Portafolio;