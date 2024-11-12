// cryptoRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { verificarToken } = require('./authRoutes'); // Importar el middleware

// Ruta para obtener lista de criptomonedas desde Coinlayer (requiere autenticación)
router.get('/lista', verificarToken, async (req, res) => {
    try {
        const respuesta = await axios.get(`https://api.coinlayer.com/live`, {
            params: {
                access_key: process.env.COINLAYER_API_KEY,
                target: 'USD',
            }
        });

        res.json(respuesta.data.rates);  // Enviar las tasas de criptomonedas al frontend
    } catch (error) {
        res.status(500).json({ msg: 'Error Obtaining cryptos', error });
    }
});

module.exports = router;