import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para navegación
import axios, { AxiosError } from 'axios';

const AgregarSaldo: React.FC = () => {
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleAgregarSaldo = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://localhost:5000/api/saldo/agregar', 
        { amount: parseFloat(monto).toFixed(2) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Monto a agregar:', parseFloat(monto)); // Verificar qué monto estás enviando
      console.log('Respuesta del servidor:', response.data);  // Verifica la respuesta del backend
      setMensaje('Saldo agregado exitosamente.');
      setMonto('');  // Limpiar el campo de monto
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error.response?.data);
        setMensaje('Error al agregar saldo: ' + error.response?.data?.msg || 'Error del servidor');
      } else {
        console.error('Error desconocido:', error);
        setMensaje('Error desconocido al agregar saldo');
      }
    }
  };

  return (
    <div>
      <h2>Adding Founds</h2>
      <input 
        type="number" 
        placeholder="Monto en USD" 
        value={monto} 
        onChange={(e) => setMonto(e.target.value)} 
      />
      <button onClick={handleAgregarSaldo}>Add Founds</button>
      <button onClick={() => navigate('/home')}>Return Home</button> {/* Botón para volver a Home */}
      <p>{mensaje}</p>
    </div>
  );
};

export default AgregarSaldo;