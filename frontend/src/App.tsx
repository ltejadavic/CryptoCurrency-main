import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AgregarSaldo from './components/AgregarSaldo';
import ListaCriptomonedas from './components/ListaCriptomonedas';
import Cashout from './components/Cashout';
import Graficas from './components/Graficas';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/agregar-saldo" element={<ProtectedRoute><AgregarSaldo /></ProtectedRoute>} />
        <Route path="/lista-criptomonedas" element={<ProtectedRoute><ListaCriptomonedas /></ProtectedRoute>} />
        <Route path="/cashout" element={<Cashout />} />
        <Route path="/graficas" element={<ProtectedRoute><Graficas /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;