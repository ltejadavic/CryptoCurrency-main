import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        contraseña: password,  // Verifica que la propiedad sea la correcta en el backend ('contraseña')
      });
      
      localStorage.setItem('token', response.data.token); // Guardar token en localStorage
      navigate('/home'); // Redirigir al home después del login exitoso
    } catch (error: any) {  // Usamos 'any' para evitar el tipo 'unknown'
        if (error.response && error.response.data && error.response.data.msg) {
          // Mostrar el mensaje de error específico del servidor, si existe
          setError(error.response.data.msg);
        } else {
          setError('Credenciales incorrectas');
        }
        console.error('Error en el login', error);
      }
    };

    return (
      <div className="auth-container">
      <div className="container">  {/* Usar el container definido en CSS */}
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}  {/* Clase para el mensaje de error */}
        <p>Don't you have an account? 
          <span onClick={() => navigate('/register')} className="link">Register Here</span>
        </p>
      </div>
      </div>
    );
  };

export default Login;