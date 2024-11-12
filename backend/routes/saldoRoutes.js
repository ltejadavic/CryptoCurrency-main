const express = require('express');
const router = express.Router();
const { verificarToken } = require('./authRoutes');  
const User = require('../models/User');  

// Ruta para obtener el saldo (requiere autenticación)
router.get('/', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            attributes: ['saldo']
        });
        if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json({ saldo: usuario.saldo });
    } catch (error) {
        res.status(400).json({ msg: 'Error al obtener el saldo' });
    }
});

// Ruta para agregar saldo (requiere autenticación)
router.post('/agregar', verificarToken, async (req, res) => {
    const { amount } = req.body;
    console.log('Monto recibido:', amount);  // Registro para verificar el monto recibido

    // Validar el valor del monto
    if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ msg: 'Monto no válido' });
    }

    try {
        const usuario = await User.findByPk(req.usuario.id);
        if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Actualizar el saldo con 2 decimales y convertirlo a número
        usuario.saldo = (parseFloat(usuario.saldo) + parseFloat(amount)).toFixed(2);
        await usuario.save();

        console.log('Nuevo saldo del usuario:', usuario.saldo);  // Verificar el nuevo saldo

        res.json({ saldo: usuario.saldo });
    } catch (error) {
        console.error('Error al actualizar el saldo:', error);  // Ver error en consola
        res.status(400).json({ msg: 'Error al actualizar el saldo' });
    }
});

module.exports = router;