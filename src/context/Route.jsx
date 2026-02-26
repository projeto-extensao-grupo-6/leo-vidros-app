import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/Login/login.jsx";
import Cadastro from "../pages/Cadastro/cadastro.jsx";
import PaginaInicial from "../pages/pagina-inicial/paginaInicial.jsx";
import Funcionarios from "../pages/Funcionarios/funcionarios.jsx";
import Clientes from "../pages/Clientes/clientes.jsx";
import Estoque from "../pages/Estoque/estoque.jsx";
import ProdutoDetalhe from "../pages/Estoque/ProdutoDetalhe.jsx";
import Pedidos from "../pages/Pedidos/pedidos.jsx";
import Solicitacoes from "../pages/solicitacoes/Solicitacoes.jsx";
import CalendarDashboard from "../pages/calendar-dashboard/index.jsx";
import Perfil from "../pages/Perfil/perfil.jsx";
import MapContainer from "../pages/geo-localizacao/MapContainer.jsx";
import NovaSenha from "../pages/nova-senha/novaSenha.jsx";
import EsqueceuSenha from "../pages/esqueceu-senha/EsqueceuSenha.jsx";

export const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/Login", element: <Login /> },
  { path: "/Cadastro", element: <Cadastro /> },
  {
    path: "/pagina-inicial",
    element: (
      <ProtectedRoute>
        <PaginaInicial />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Funcionarios",
    element: (
      <ProtectedRoute>
        <Funcionarios />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Clientes",
    element: (
      <ProtectedRoute>
        <Clientes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Estoque",
    element: (
      <ProtectedRoute>
        <Estoque />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Pedidos",
    element: (
      <ProtectedRoute>
        <Pedidos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/acesso",
    element: (
      <ProtectedRoute>
        <Solicitacoes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Agendamentos",
    element: (
      <ProtectedRoute>
        <CalendarDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Estoque/:id",
    element: (
      <ProtectedRoute>
        <ProdutoDetalhe />
      </ProtectedRoute>
    ),
  },
  {
    path: "/primeiroAcesso/:idUsuario",
    element: (
      <ProtectedRoute>
        <NovaSenha />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Perfil",
    element: (
      <ProtectedRoute>
        <Perfil />
      </ProtectedRoute>
    ),
  },
  {
    path: "/geo-localizacao",
    element: (
      <ProtectedRoute>
        <MapContainer />
      </ProtectedRoute>
    ),
  },
  { path: "/esqueceu-senha", element: <EsqueceuSenha /> },
]);
