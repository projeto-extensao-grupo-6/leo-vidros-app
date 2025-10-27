import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './pages/login/login.jsx';
import Cadastro from './pages/cadastro/cadastro.jsx';
import PaginaInicial from './pages/paginaInicial/paginaInicial.jsx';
import Funcionarios from './pages/funcionarios/funcionarios.jsx';
import Clientes from './pages/clientes/clientes.jsx';
import Estoque from './pages/estoque/estoque.jsx';
import Pedidos from './pages/pedidos/pedidos.jsx';
import CalendarDashboard from './pages/calendar-dashboard.jsx/index.jsx';
import Solicitacoes from './pages/solicitacoes/Solicitacoes.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/paginaInicial" element={<PaginaInicial />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path='/agendamentos' element={<CalendarDashboard />} />
      <Route path="/servicos" element={<Pedidos />} />
      <Route path="/acesso" element={<Solicitacoes />} />
    </Routes>
  );
}

export default App;