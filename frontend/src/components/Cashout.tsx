import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cashout.css';

// Define la interfaz para los portafolios
interface Portafolio {
  id: number;
  criptomoneda: string;
  cantidad_invertida: number;
  precio_compra: number;
}

const Cashout: React.FC = () => {
  const [portafolios, setPortafolios] = useState<Portafolio[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [totalDolares, setTotalDolares] = useState(0); // Total de USD en cashout
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Obtener los portafolios
      axios.get('http://localhost:5000/api/portafolio/lista', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setPortafolios(response.data);

        // Cargar precios actuales desde el JSON local
        const preciosCriptos = localStorage.getItem('preciosCriptos');
        if (preciosCriptos) {
          const preciosActuales = JSON.parse(preciosCriptos); 
          
          // Calcular el valor total en USD de todas las criptomonedas
          let total = 0;
          response.data.forEach((portafolio: Portafolio) => {
            const precioActual = preciosActuales[portafolio.criptomoneda];
            if (precioActual) {
              const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra);
              const valorEnDolares = cantidadCriptos * Number(precioActual);
              total += valorEnDolares;
            }
          });
          setTotalDolares(total);
        }
      })
      .catch(error => console.error('Error al obtener los portafolios', error));
    }
  }, []);

  // Función para realizar el cashout
  const handleCashout = async (portafolio: Portafolio) => {
    const token = localStorage.getItem('token');
    const preciosCriptos = localStorage.getItem('preciosCriptos');
    
    if (preciosCriptos && token) {
      const preciosActuales = JSON.parse(preciosCriptos);
      const precioActual = preciosActuales[portafolio.criptomoneda];
      
      if (precioActual) {
        const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra);
        const valorEnDolares = cantidadCriptos * Number(precioActual);

        try {
          // Lógica de cashout (actualizar saldo del usuario y eliminar o actualizar portafolio)
          const response = await axios.post('http://localhost:5000/api/portafolio/cashout', 
            { idPortafolio: portafolio.id, cantidadCriptos, valorEnDolares },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMensaje(`Has hecho cashout de ${cantidadCriptos.toFixed(6)} ${portafolio.criptomoneda} por ${valorEnDolares.toFixed(2)} USD.`);
          // Actualizar la lista de portafolios
          setPortafolios(prev => prev.filter(p => p.id !== portafolio.id));
        } catch (error) {
          console.error('Error al hacer cashout', error);
          setMensaje('Error al realizar el cashout.');
        }
      }
    }
  };

  return (
    <div className="cashout-container">
      <h2>Investment Cashout</h2>

      <div className="portfolio-list">
        {portafolios.map((portafolio) => {
          const preciosCriptos = localStorage.getItem('preciosCriptos');
          const preciosActuales = preciosCriptos ? JSON.parse(preciosCriptos) : {};
          const precioActual = preciosActuales[portafolio.criptomoneda];
          const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra);

          return (
            <div key={portafolio.id} className="portfolio-item">
              <div>
                <strong>{portafolio.criptomoneda}</strong> <strong>{cantidadCriptos.toFixed(6)} units</strong>
              </div>
              <div>
                Actual Value: ${precioActual ? (cantidadCriptos * Number(precioActual)).toFixed(2) : 'Desconocido'}
              </div>
              <button onClick={() => handleCashout(portafolio)} className="cashout-button">Cashout</button>
            </div>
          );
        })}
      </div>

      <div className="total-summary">
        <p>Total USD in cashout: ${totalDolares.toFixed(2)}</p>
        <p>{mensaje}</p>
      </div>

      <button onClick={() => navigate('/home')} className="home-button">return to Home</button>
    </div>
  );
};

export default Cashout;