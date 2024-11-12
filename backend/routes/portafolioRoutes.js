const express = require('express');
const axios = require('axios');  // Para hacer la solicitud a la API de Coinlayer
const router = express.Router();
const { verificarToken } = require('./authRoutes');  // Middleware de autenticación
const Portafolio = require('../models/Portafolio');  // Modelo Portafolio
const User = require('../models/User');  // Modelo User para actualizar el saldo

// Ruta para realizar una inversión
router.post('/invertir', verificarToken, async (req, res) => {
    const { criptomoneda, monto } = req.body;

    // Agregar logs para verificar la entrada
    console.log('Crypto Selected:', criptomoneda);
    console.log('Amount to Invest:', monto);

    try {
        // Obtener al usuario
        const usuario = await User.findByPk(req.usuario.id);
        if (!usuario) return res.status(404).json({ msg: 'User not found' });

        // Validar que el usuario tenga saldo suficiente
        if (monto > usuario.saldo) {
            return res.status(400).json({ msg: 'not enought money' });
        }

        // Obtener el precio actual de la criptomoneda desde la API de Coinlayer
        const precio_compra = await obtenerPrecioCriptomoneda(criptomoneda);
        console.log('Crypto Price:', precio_compra);

        if (!precio_compra) {
            return res.status(500).json({ msg: 'Error obtaining Criptocurrency' });
        }

        // Crear la inversión en el portafolio
        const nuevaInversion = await Portafolio.create({
            usuario_id: usuario.id,
            criptomoneda,
            cantidad_invertida: monto,
            precio_compra
        });

        // Restar el monto invertido del saldo del usuario
        usuario.saldo -= monto;
        await usuario.save();

        res.json({ msg: 'Investment done', inversion: nuevaInversion });
    } catch (error) {
        console.error('Error doing inversion:', error);
        res.status(500).json({ msg: 'Error doing inversion', error });
    }
});

// Ruta para listar los portafolios de un usuario
router.get('/lista', verificarToken, async (req, res) => {
    try {
        // Obtener los portafolios del usuario autenticado
        const portafolios = await Portafolio.findAll({
            where: { usuario_id: req.usuario.id }
        });

        if (!portafolios) {
            return res.status(404).json({ msg: 'Portfolio not found.' });
        }

        res.json(portafolios);
    } catch (error) {
        console.error('Error obtaining portafolio:', error);
        res.status(500).json({ msg: 'Error obtaining portafolio', error });
    }
});

// Ruta para hacer cashout de una criptomoneda
router.post('/cashout', verificarToken, async (req, res) => {
    const { idPortafolio, cantidadCriptos, valorEnDolares } = req.body;

    try {
      // Obtener el usuario autenticado mediante el middleware verificarToken
      const usuario = await User.findOne({ where: { id: req.usuario.id } });

      if (!usuario) {
        return res.status(404).json({ message: 'User not Found' });
      }

      // Obtener el portafolio por su ID
      const portafolio = await Portafolio.findOne({ where: { id: idPortafolio, usuario_id: req.usuario.id } });

      if (!portafolio) {
        return res.status(404).json({ message: 'Portafolio not found' });
      }

      // Sumar el valor en dólares al saldo actual
      const nuevoSaldo = parseFloat(usuario.saldo) + parseFloat(valorEnDolares);
      usuario.saldo = nuevoSaldo.toFixed(2);  // Asegurarse de que solo tenga dos decimales

      await usuario.save();  // Guardar el nuevo saldo del usuario

      // Eliminar el portafolio después del cashout
      await portafolio.destroy();

      res.json({ message: `You made a cashout of ${cantidadCriptos.toFixed(6)} ${portafolio.criptomoneda} por ${valorEnDolares.toFixed(2)} USD.` });
    } catch (error) {
      console.error('Error in cashout:', error);
      res.status(500).json({ message: 'Error doing cashout' });
    }
});

// Función para obtener el precio actual de la criptomoneda desde la API Coinlayer
async function obtenerPrecioCriptomoneda(criptomoneda) {
    try {
        const response = await axios.get('http://api.coinlayer.com/live', {
            params: {
                access_key: process.env.COINLAYER_API_KEY,  // Tu clave de acceso
                target: 'USD',
                symbols: criptomoneda
            }
        });

        if (response.data.success) {
            return response.data.rates[criptomoneda];  // Retorna el precio de la criptomoneda
        } else {
            console.error('Error al obtener los datos de la API de Coinlayer:', response.data.error);
            return null;
        }
    } catch (error) {
        console.error('Error al conectarse a la API de Coinlayer:', error);
        return null;
    }
}

module.exports = router;