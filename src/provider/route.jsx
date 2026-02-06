import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute.jsx';
import PageLoader from '../shared/components/feedback/PageLoader.jsx';

// Páginas públicas - carregamento imediato
import Login from '../pages/login/login.jsx';
import Cadastro from '../pages/cadastro/cadastro.jsx';
import EsqueceuSenha from '../pages/esqueceuSenha/EsqueceuSenha.jsx';

// Páginas privadas - lazy loading
const PaginaInicial = lazy(() => import('../pages/paginaInicial/paginaInicial.jsx'));
const Funcionarios = lazy(() => import('../pages/funcionarios/funcionarios.jsx'));
const Clientes = lazy(() => import('../pages/clientes/clientes.jsx'));
const Estoque = lazy(() => import('../pages/estoque/estoque.jsx'));
const ProdutoDetalhe = lazy(() => import('../pages/estoque/ProdutoDetalhe.jsx'));
const Pedidos = lazy(() => import('../pages/pedidos/pedidos.jsx'));
const Solicitacoes = lazy(() => import('../pages/solicitacoes/Solicitacoes.jsx'));
const CalendarDashboard = lazy(() => import('../pages/calendar-dashboard/index.jsx'));
const Perfil = lazy(() => import('../pages/perfil/perfil.jsx'));
const MapContainer = lazy(() => import('../pages/geoLocalizacao/MapContainer.jsx'));
const NovaSenha = lazy(() => import('../pages/novaSenha/novaSenha.jsx'));

// Wrapper para páginas com Suspense
const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

export const routes = createBrowserRouter([
  { path: '/', element: <Login /> }, 
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <Cadastro /> },
  { path: '/esqueceuSenha', element: <EsqueceuSenha /> },
  { 
    path: '/paginaInicial', 
    element: <ProtectedRoute><LazyPage><PaginaInicial /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/funcionarios', 
    element: <ProtectedRoute><LazyPage><Funcionarios /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/clientes', 
    element: <ProtectedRoute><LazyPage><Clientes /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/estoque', 
    element: <ProtectedRoute><LazyPage><Estoque /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/estoque/:id', 
    element: <ProtectedRoute><LazyPage><ProdutoDetalhe /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/pedidos', 
    element: <ProtectedRoute><LazyPage><Pedidos /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/acesso', 
    element: <ProtectedRoute><LazyPage><Solicitacoes /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/agendamentos', 
    element: <ProtectedRoute><LazyPage><CalendarDashboard /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/primeiroAcesso/:idUsuario', 
    element: <ProtectedRoute><LazyPage><NovaSenha /></LazyPage></ProtectedRoute>
  },
  { 
    path: '/perfil', 
    element: <ProtectedRoute><LazyPage><Perfil /></LazyPage></ProtectedRoute> 
  },
  { 
    path: '/geoLocalizacao', 
    element: <ProtectedRoute><LazyPage><MapContainer /></LazyPage></ProtectedRoute> 
  },
]);