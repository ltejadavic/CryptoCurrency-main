import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Interfaz para los portafolios
interface Portafolio {
  id: number;
  criptomoneda: string;
  cantidad_invertida: number;
  precio_compra: number;
}

const Graficas: React.FC = () => {
  const [portafolios, setPortafolios] = useState<Portafolio[]>([]);
  const [data, setData] = useState<any[]>([]); // Para almacenar los datos del gráfico
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Obtener los portafolios del usuario
      axios.get('http://localhost:5000/api/portafolio/lista', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setPortafolios(response.data);

        // Cargar precios desde el JSON local
        const preciosCriptos = localStorage.getItem('preciosCriptos');
        if (preciosCriptos) {
          const preciosActuales = JSON.parse(preciosCriptos);
          const chartData: any[] = [];

          // Generar los datos para cada criptomoneda
          response.data.forEach((portafolio: Portafolio) => {
            const precioActual = preciosActuales[portafolio.criptomoneda];
            const cantidadCriptos = Number(portafolio.cantidad_invertida) / Number(portafolio.precio_compra);

            if (precioActual) {
              chartData.push({
                labels: ['Purchase Price', 'Actual Price'],
                datasets: [{
                  label: `${portafolio.criptomoneda}`,
                  data: [portafolio.precio_compra, precioActual],  // Comparar compra vs. actual
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
              });
            }
          });

          setData(chartData);  // Establecer los datos del gráfico
        }
      })
      .catch(error => console.error('Error al obtener los portafolios', error));
    }
  }, []);

  return (
    <div>
      <h2>Graphs Comparison</h2>
      {data.length > 0 ? (
        data.map((chartData, index) => (
          <div key={index}>
            <h3>Graphs for {portafolios[index].criptomoneda}</h3>
            <Line data={chartData} />
          </div>
        ))
      ) : (
        <p>Loading criptocurrencies...</p>
      )}
      <button onClick={() => navigate('/home')}>Return to Home</button>
    </div>
  );
};

export default Graficas;