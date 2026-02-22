/**
 * Configuração centralizada das rotas da aplicação.
 *
 * Rotas públicas  → acessíveis sem autenticação (login, cadastro, esqueceu-senha).
 * Rotas privadas → envolvidas por <ProtectedRoute>, que redireciona para /Login
 *                  quando o usuário não está autenticado.
 */
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../contexts/ProtectedRoute.jsx';
import Login from '../pages/login/Login.jsx';
import Cadastro from '../pages/cadastro/Cadastro.jsx';
import PaginaInicial from '../pages/pagina-inicial/PaginaInicial.jsx';
import Funcionarios from '../pages/funcionarios/Funcionarios.jsx';
import Clientes from '../pages/clientes/Clientes.jsx';
import Estoque from '../pages/estoque/Estoque.jsx';
import ProdutoDetalhe from '../pages/estoque/ProdutoDetalhe.jsx';
import Pedidos from '../pages/pedidos/Pedidos.jsx';
import Solicitacoes from '../pages/solicitacoes/Solicitacoes.jsx';
import CalendarDashboard from '../pages/calendar-dashboard/index.jsx';
import Perfil from '../pages/perfil/Perfil.jsx';
import MapContainer from '../pages/geo-localizacao/MapContainer.jsx';
import NovaSenha from '../pages/nova-senha/NovaSenha.jsx';
import EsqueceuSenha from '../pages/esqueceu-senha/EsqueceuSenha.jsx';

export const appRouter = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/Login', element: <Login /> },
  { path: '/Cadastro', element: <Cadastro /> },
  { path: '/pagina-inicial', element: <ProtectedRoute><PaginaInicial /></ProtectedRoute> },
  { path: '/Funcionarios', element: <ProtectedRoute><Funcionarios /></ProtectedRoute> },
  { path: '/Clientes', element: <ProtectedRoute><Clientes /></ProtectedRoute> },
  { path: '/Estoque', element: <ProtectedRoute><Estoque /></ProtectedRoute> },
  { path: '/Estoque/:id', element: <ProtectedRoute><ProdutoDetalhe /></ProtectedRoute> },
  { path: '/Pedidos', element: <ProtectedRoute><Pedidos /></ProtectedRoute> },
  { path: '/acesso', element: <ProtectedRoute><Solicitacoes /></ProtectedRoute> },
  { path: '/Agendamentos', element: <ProtectedRoute><CalendarDashboard /></ProtectedRoute> },
  { path: '/primeiroAcesso/:idUsuario', element: <ProtectedRoute><NovaSenha /></ProtectedRoute> },
  { path: '/Perfil', element: <ProtectedRoute><Perfil /></ProtectedRoute> },
  { path: '/geo-localizacao', element: <ProtectedRoute><MapContainer /></ProtectedRoute> },
  { path: '/esqueceu-senha', element: <EsqueceuSenha /> },
]);
