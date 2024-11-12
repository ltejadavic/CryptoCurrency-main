import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');  // Mensaje de feedback
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cambia la URL para que apunte a tu servidor backend
      await axios.post('http://localhost:5000/auth/register', { nombre, email, contraseña: password });
      
      // Mensaje de éxito
      setMensaje('Usuario registrado exitosamente.');
      
      // Limpiar los campos después del registro exitoso
      setNombre('');
      setEmail('');
      setPassword('');

      // Redirigir al login después de un tiempo
      setTimeout(() => {
        navigate('/login');
      }, 2000);  // Redirigir después de 2 segundos
    } catch (error) {
      console.error('Error en el registro', error);
      setMensaje('Hubo un error en el registro. Intenta de nuevo.');
    }
  };

  return (
    <div className="auth-container">
    <div className="container">  {/* Usar el container definido en CSS */}
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Register</button>
      </form>
      <p className={mensaje.includes('error') ? 'error-message' : 'success-message'}>
        {mensaje}
      </p>
      <p>Already Have an Account? 
        <span onClick={() => navigate('/login')} className="link">Login Here</span>
      </p>
    </div>
    </div>
  );
};


export default Register;