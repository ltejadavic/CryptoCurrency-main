import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Define la interfaz para los portafolios
interface Portafolio {
  id: number;
  criptomoneda: string;
  cantidad_invertida: number; // Este es el monto en USD invertido
  precio_compra: number; // Precio de compra por unidad de la criptomoneda
}

const Home: React.FC = () => {
  const [user, setUser] = useState<{ nombre: string, saldo: number } | null>(null);
  const [portafolios, setPortafolios] = useState<Portafolio[]>([]);
  const [valorTotalUSD, setValorTotalUSD] = useState(0); // Para mostrar el total en dólares
  const [porcentajeTotal, setPorcentajeTotal] = useState(0); // Para mostrar el porcentaje total de ganancia/pérdida
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Obtener los datos del usuario
      axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))
      .catch(error => console.error('Error al obtener el usuario', error));

      // Obtener los portafolios
      axios.get('http://localhost:5000/api/portafolio/lista', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setPortafolios(response.data);

        // Cargar precios desde localStorage
        const preciosCriptos = localStorage.getItem('preciosCriptos');
        if (preciosCriptos) {
          const preciosActuales = JSON.parse(preciosCriptos); // Parsear el JSON local

          // Calcular el valor total en USD y el porcentaje total de ganancia/pérdida
          let totalInvertido = 0;
          let totalValorActual = 0;

          response.data.forEach((portafolio: Portafolio) => {
            const precioActual = preciosActuales[portafolio.criptomoneda];
            if (precioActual) {
              const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra); // Asegurarse de que son números
              const valorEnDolares = cantidadCriptos * Number(precioActual); // Valor en USD actual de la inversión

              totalInvertido += Number(portafolio.cantidad_invertida);
              totalValorActual += valorEnDolares;
            }
          });

          setValorTotalUSD(totalValorActual); // Actualizar el valor total en USD

          // Calcular el porcentaje total de ganancia o pérdida
          const porcentaje = ((totalValorActual - totalInvertido) / totalInvertido) * 100;
          setPorcentajeTotal(porcentaje);
        }
      })
      .catch(error => console.error('Error al obtener los portafolios', error));
    }
  }, []);

  // Función para desloguearse
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
    <div>
      <h2 className="welcome-message">Home Panel</h2>
      {user ? (
        <>
          <h3 className="welcome-name">Welcome, {user.nombre}!</h3>
          <h3 className="important-info">Your Balance is: ${user.saldo}</h3>

          {/* Mostrar el valor total en USD y el porcentaje de ganancia o pérdida */}
          <h3 className="important-info">
            Total Investment in USD: ${valorTotalUSD.toFixed(2)} 
            ({porcentajeTotal.toFixed(2)}%)
          </h3>

          {/* Botones */}
          <button onClick={() => navigate('/agregar-saldo')}>Add Founds</button>
          <button onClick={() => navigate('/lista-criptomonedas')}>Buy Cryptos</button>
          <button onClick={() => navigate('/cashout')}>Cashout</button>{/* Botón para ir a Cashout */}
          <button onClick={() => navigate('/graficas')}>Graphs</button>

          {/* Listar los portafolios del usuario */}
          <div className="investment-section">
            <h3>My Invesments:</h3>
            {portafolios.map((portafolio) => {
              const preciosCriptos = localStorage.getItem('preciosCriptos');
              const preciosActuales = preciosCriptos ? JSON.parse(preciosCriptos) : {};
              const precioActual = preciosActuales[portafolio.criptomoneda];
              const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra);
              const porcentajeGanancia = ((Number(precioActual) - Number(portafolio.precio_compra)) / Number(portafolio.precio_compra)) * 100;
              const progressBarWidth = Math.abs(porcentajeGanancia);
              
              return (
                <div key={portafolio.id} className="investment-card">
                  <div className="investment-details">
                    <strong>{portafolio.criptomoneda}:</strong> {cantidadCriptos.toFixed(6)} unidades
                    <br />
                    Invested: ${Number(portafolio.cantidad_invertida).toFixed(2)} a un precio de compra de ${Number(portafolio.precio_compra).toFixed(2)}
                    <br />
                    Present Value: ${precioActual ? (cantidadCriptos * Number(precioActual)).toFixed(2) : 'Desconocido'}
                    <br />
                    <span className={porcentajeGanancia < 0 ? "negative" : ""}>
                      Profit/Loss: {porcentajeGanancia.toFixed(2)}%
                      <div className="progress-bar">
                        <div className="progress-bar-inner" style={{ width: `${progressBarWidth}%` }}></div>
                      </div>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
};

export default Home;