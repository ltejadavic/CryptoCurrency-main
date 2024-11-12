// index.js
const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const sequelize = require('./db'); // Base de datos

// Habilitar CORS
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Importar las rutas
const { router: authRoutes } = require('./routes/authRoutes'); // Exporta solo el router
const saldoRoutes = require('./routes/saldoRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const portafolioRoutes = require('./routes/portafolioRoutes');

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas para saldo
app.use('/api/saldo', saldoRoutes);

// Rutas para criptomonedas
app.use('/api/cryptos', cryptoRoutes);

// Rutas para el portafolio
app.use('/api/portafolio', portafolioRoutes);  // Añadir las rutas del portafolio

// Ruta simple para probar el estado del API
app.get('/', (req, res) => {
    res.send('API en funcionamiento');
});

// Sincronizar la base de datos
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        
        // Iniciar el servidor después de sincronizar la base de datos
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => console.error('Error al sincronizar la base de datos:', err));