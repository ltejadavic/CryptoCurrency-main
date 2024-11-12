import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('token');  // Verifica si el token existe

  if (!isAuthenticated) {
    return <Navigate to="/login" />;  // Redirige al login si no está autenticado
  }

  return children;  // Muestra el contenido si está autenticado
};

export default ProtectedRoute;