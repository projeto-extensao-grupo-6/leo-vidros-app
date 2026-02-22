#  Leo Vidros  Sistema de Gestão

Sistema web completo para gerenciamento de uma empresa de vidros e esquadrias, desenvolvido com **React + Vite**. Contempla controle de pedidos, estoque, agendamentos, clientes, funcionários e geolocalização, com uma interface moderna e responsiva.

---

##  Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Camada de API e Cache](#camada-de-api-e-cache)
- [Formulários e Validação](#formulários-e-validação)
- [Roteamento e Autenticação](#roteamento-e-autenticação)
- [Aliases de Importação](#aliases-de-importação)

---

## Visão Geral

O **Leo Vidros App** é um sistema de gestão desenvolvido para apoiar as operações diárias de uma empresa do setor de vidros e esquadrias. A plataforma centraliza:

- Criação e acompanhamento de **pedidos** de produtos e serviços
- Controle detalhado de **estoque** com histórico de movimentações e alertas de nível crítico
- Gestão de **agendamentos** com visualização em calendário interativo
- Cadastro e acompanhamento de **clientes** e **funcionários**
- **Dashboard** com KPIs em tempo real
- **Geolocalização** integrada com Google Maps para endereços de entrega

---

## Tecnologias

### Core
| Tecnologia | Versão | Descrição |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [Vite](https://vitejs.dev/) | 6 | Build tool e dev server |
| [React Router DOM](https://reactrouter.com/) | 7 | Roteamento SPA |

### Estado Assíncrono e Dados
| Tecnologia | Versão | Descrição |
|---|---|---|
| [TanStack Query](https://tanstack.com/query) | 5 | Cache e ciclo de vida de dados assíncronos |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP com interceptors de autenticação |

### Formulários e Validação
| Tecnologia | Versão | Descrição |
|---|---|---|
| [React Hook Form](https://react-hook-form.com/) | 7 | Formulários de alta performance (uncontrolled) |
| [Zod](https://zod.dev/) | 4 | Validação e parsing de schema com tipagem |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 5 | Integração RHF  Zod |

### UI & Estilização
| Tecnologia | Versão | Descrição |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework |
| [MUI (Material UI)](https://mui.com/) | 7 | Componentes de interface ricos |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animações declarativas |
| [Lucide React](https://lucide.dev/) | 0.5x | Ícones SVG modernos |
| [Recharts](https://recharts.org/) | 3 | Gráficos e visualizações |
| [SweetAlert2](https://sweetalert2.github.io/) | 11 | Modais e alertas estilizados |

### Máscaras e Utilitários
| Tecnologia | Versão | Descrição |
|---|---|---|
| [react-imask](https://imask.js.org/) | 7 | Máscaras de input (CPF, Telefone, CEP) |
| [date-fns](https://date-fns.org/) | 4 | Manipulação e formatação de datas |
| [jwt-decode](https://github.com/auth0/jwt-decode) | 4 | Decodificação de tokens JWT |
| [xlsx](https://sheetjs.com/) | 0.18 | Exportação de dados para planilhas Excel |
| [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/) | 2 | Integração com Google Maps |

---

## Funcionalidades

###  Dashboard (Página Inicial)
- KPIs em tempo real: agendamentos do dia, agendamentos futuros, taxa de ocupação de serviços e itens críticos no estoque
- Tabela de próximos agendamentos com data e cliente
- Painel de alertas de estoque crítico com destaque visual

###  Estoque
- Listagem de produtos com busca textual e filtros
- **Página de detalhe do produto** (`/Estoque/:id`) com:
  - KPIs individuais (quantidade disponível, reservada, total e nível mínimo)
  - Gráfico de linha com variação histórica de estoque
  - Tabela de movimentações (entradas e saídas) com modal de detalhe
  - Edição inline de campos (nome, descrição, localização, preço, unidade de medida)
  - Gerenciamento de atributos personalizados (cor, espessura, acabamento, etc.)
  - Ativação e desativação do produto

###  Pedidos
- **Aba Produtos**: fluxo multi-etapas  *Cliente  Produtos  Pagamento  Revisão*
- **Aba Serviços**: fluxo multi-etapas  *Cliente  Endereço  Serviços  Revisão*
- Suporte a cliente existente, novo cliente e cliente avulso
- Listagem com busca, filtro por status e paginação
- Edição e exclusão de pedidos existentes
- Exportação da listagem para planilha Excel

###  Agendamentos
- Visualização em **calendário** com alternância entre visões (dia, semana, mês)
- Criação, edição e cancelamento de agendamentos
- Filtros por funcionário responsável e por status

###  Clientes
- CRUD completo com formulário validado por **React Hook Form + Zod**
- Consulta de CEP automática via API ViaCEP com preenchimento de endereço
- Inputs com máscara automática (CPF, telefone, CEP)
- Filtro por status (Ativo, Inativo, Avulso)

###  Funcionários
- Cadastro e gerenciamento de funcionários da empresa
- Controle de funções e permissões de acesso ao sistema
- Gerenciamento de solicitações de acesso

###  Geolocalização
- Visualização de endereços de clientes e pedidos no mapa interativo
- Integração com Google Maps via `@react-google-maps/api`

###  Perfil
- Atualização de dados pessoais (nome, e-mail)
- Upload e persistência de foto de perfil (armazenada no `localStorage`)
- Alteração de senha

---

## Arquitetura do Projeto

O projeto segue uma arquitetura em camadas bem definida:

```
Browser
   React Router v7 (AppRouter)
         ProtectedRoute (guarda de autenticação via sessionStorage)
               Pages (componentes de página por domínio)
                     Hooks de Query (TanStack Query)
                          Services (BaseService + Axios)
                                API REST (Spring Boot Backend)
                     Components (UI reutilizável e independente)
```

### Fluxo de Dados com TanStack Query

```
useQuery / useMutation
   queryFn  chama Service.metodo()
         Service retorna { success, data, error }
               Hook desempacota o resultado
                     success: true   retorna data para o componente
                     success: false  lança erro
                           TanStack Query gerencia: cache, isLoading, isError, refetch
```

---

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Backend (Spring Boot)** rodando e acessível  padrão: `http://localhost:8080`

---

## Instalação e Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/leo-vidros-app.git
cd leo-vidros-app

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com o conteúdo da próxima seção

# 4. Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em **http://localhost:5173**.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL base da API do backend (Spring Boot)
VITE_API_URL=http://localhost:8080/api

# Chave da API do Google Maps (necessária para a página de Geolocalização)
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

> A instância Axios (`src/api/client/Api.jsx`) usa `VITE_API_URL` como `baseURL`, injeta `Content-Type: application/json` automaticamente em POST/PUT e redireciona para `/Login` em respostas **401/403**, limpando todos os dados de sessão.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento Vite com HMR |
| `npm run build` | Gera o bundle otimizado de produção em `/dist` |
| `npm run preview` | Serve o bundle de produção localmente para validação |
| `npm run lint` | Executa o ESLint nos arquivos `.js` e `.jsx` |

---

## Estrutura de Pastas

```
src/
 api/
    client/
       Api.jsx               # Instância Axios com interceptors de auth
       BaseService.js        # Classe base com retorno padronizado
    services/                 # Services por domínio
       agendamentosService.js
       dashboardService.js
       pedidosService.js
       servicosService.js
    queryKeys.js              # Factory de query keys hierárquicas
    index.js                  # Barrel exports

 components/
    core/                     # ErrorBoundary, ScrollToTop
    feedback/                 # Toast, SkeletonLoader, CircularProgress
    kpis/                     # Componente de KPIs reutilizável
    layout/                   # Header, Sidebar
    overlay/                  # Modal base, Backdrop, SuccessModal
    stepper/                  # QontoStepper (indicador multi-etapas)
    ui/
        Button/
        Form/
           FormField.jsx     # Campo genérico compatível com React Hook Form
        Input/

 context/
    UserContext.jsx           # Contexto global do usuário autenticado

 contexts/
    ProtectedRoute.jsx        # HOC de guarda de rota

 hooks/
    queries/                  # Hooks TanStack Query por domínio
       useDashboard.js       # useDashboardKpis() e hooks individuais
       useAgendamentos.js
       usePedidos.js
       index.js
    useModal.js
    usePagination.js

 lib/
    queryClient.js            # Singleton QueryClient configurado
    schemas.js                # Todos os schemas Zod centralizados

 pages/
    agendamentos/
    calendar-dashboard/       # Calendário com hooks e utils próprios
    clientes/
       components/
           ClienteFormModal.jsx   # Formulário completo RHF + Zod
    estoque/
       Estoque.jsx
       ProdutoDetalhe.jsx         # Página de detalhe com KPIs e gráficos
    funcionarios/
    geo-localizacao/
    login/
    pagina-inicial/           # Dashboard com useDashboardKpis()
    pedidos/
       PedidosList.jsx            # Lista com usePedidosProduto()
       components/
           NovoPedidoProdutoModal.jsx
           NovoPedidoServicoModal.jsx
           EditarPedidoModal.jsx
    perfil/
    solicitacoes/

 router/
    AppRouter.jsx             # Definição de todas as rotas

 styles/                       # CSS global, variáveis de cores, Tailwind base

 utils/
     formatters.js             # Formatação de moeda, datas, etc.
     masks.js                  # Funções de máscara (CPF, telefone, CEP)
     cn.js                     # clsx + tailwind-merge para classes condicionais
     animation.js              # Variants reutilizáveis do Framer Motion
```

---

## Camada de API e Cache

### BaseService

Todos os services estendem `BaseService`. O retorno é sempre normalizado:

```js
// Formato padrão de retorno de todos os métodos
{ success: boolean, data: T, error?: string, status?: number }
```

### Configuração do QueryClient

```js
// src/lib/queryClient.js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,           // dados frescos por 1 minuto (sem re-fetch)
      gcTime: 300_000,             // removidos da memória após 5 minutos sem uso
      retry: 1,                    // 1 tentativa extra automática em caso de erro
      refetchOnWindowFocus: false, // sem re-fetch ao trocar de aba
    },
  },
});
```

### Query Keys Factory

Centralizadas em `src/api/queryKeys.js` para evitar strings duplicadas:

```js
queryKeys.dashboard.all()        // ['dashboard']
queryKeys.pedidos.all()          // ['pedidos']
queryKeys.pedidos.produtos()     // ['pedidos', 'produtos']
queryKeys.pedidos.detail(id)     // ['pedidos', 'detalhe', id]
queryKeys.agendamentos.all()     // ['agendamentos']
```

### Hooks disponíveis

| Hook | Arquivo | Descrição |
|---|---|---|
| `useDashboardKpis()` | `queries/useDashboard.js` | Todos os KPIs da página inicial |
| `usePedidosProduto()` | `queries/usePedidos.js` | Lista de pedidos de produto |
| `usePedidosServico()` | `queries/usePedidos.js` | Lista de pedidos de serviço |
| `useDeletarPedido()` | `queries/usePedidos.js` | Mutation com invalidação automática |
| `useAgendamentos()` | `queries/useAgendamentos.js` | Lista de agendamentos |
| `useCriarAgendamento()` | `queries/useAgendamentos.js` | Mutation que invalida dashboard |

---

## Formulários e Validação

O projeto usa **React Hook Form** (_uncontrolled components_) com **Zod**, eliminando re-renders por keystroke:

```jsx
const { register, handleSubmit, control, formState: { errors } } = useForm({
  resolver: zodResolver(clienteSchema),
  defaultValues: DEFAULT_VALUES,
  mode: 'onBlur',  // valida ao sair do campo
});

// Campos com máscara usam Controller para integrar o IMaskInput
<Controller
  name="cpf"
  control={control}
  render={({ field }) => <IMaskInput mask="000.000.000-00" {...field} />}
/>
```

### Schemas centralizados  `src/lib/schemas.js`

| Schema | Uso |
|---|---|
| `clienteSchema` | Modal de criação/edição de cliente |
| `enderecoSchema` | Sub-schema reutilizável de endereço |
| `pedidoProdutoEtapa0/1/2Schema` | Validação por etapa no modal de pedido de produto |
| `pedidoServicoEtapa0/1/2Schema` | Validação por etapa no modal de pedido de serviço |
| `zodFirstError(error)` | Helper que extrai a primeira mensagem de um `ZodError` |

---

## Roteamento e Autenticação

### Rotas da aplicação

| Caminho | Componente | Protegida |
|---|---|---|
| `/` ou `/Login` | `Login` |  |
| `/Cadastro` | `Cadastro` |  |
| `/esqueceu-senha` | `EsqueceuSenha` |  |
| `/pagina-inicial` | `PaginaInicial` (Dashboard) |  |
| `/Clientes` | `Clientes` |  |
| `/Estoque` | `Estoque` |  |
| `/Estoque/:id` | `ProdutoDetalhe` |  |
| `/Pedidos` | `Pedidos` |  |
| `/Agendamentos` | `CalendarDashboard` |  |
| `/Funcionarios` | `Funcionarios` |  |
| `/acesso` | `Solicitacoes` |  |
| `/Perfil` | `Perfil` |  |
| `/geo-localizacao` | `MapContainer` |  |
| `/primeiroAcesso/:idUsuario` | `NovaSenha` |  |

### Fluxo de Autenticação

1. Usuário faz login  backend valida e retorna dados
2. `UserContext.login()` persiste em `sessionStorage` + `localStorage` e atualiza o estado React global
3. `ProtectedRoute` verifica `sessionStorage.isAuthenticated === 'true'` antes de renderizar
4. O interceptor Axios captura **401/403**  exibe alerta  limpa todos os storages  redireciona para `/Login`

### UserContext

Fonte única de verdade para o usuário autenticado, expondo:

| Propriedade/Método | Descrição |
|---|---|
| `user.id` | ID do usuário autenticado |
| `user.name` | Nome do usuário |
| `user.email` | E-mail do usuário |
| `user.photo` | Foto de perfil (base64 ou null) |
| `user.isAuthenticated` | Booleano de autenticação |
| `login(data)` | Popula o contexto após autenticação |
| `logout()` | Limpa estado e storages |
| `updatePhoto(base64)` | Persiste e atualiza foto de perfil |

---

## Aliases de Importação

Configurados no `vite.config.js`:

| Alias | Caminho real |
|---|---|
| `@` | `src/` |
| `@api` | `src/api/` |
| `@components` | `src/components/` |
| `@pages` | `src/pages/` |
| `@utils` | `src/utils/` |
| `@contexts` | `src/contexts/` |
| `@router` | `src/router/` |
| `@constants` | `src/constants/` |
| `@assets` | `src/assets/` |

---

## Licença

Este projeto foi desenvolvido como parte de um projeto de extensão universitária  Grupo 6. Todos os direitos reservados.
