# Atualizações da Branch — Leo Vidros App


---

## Sumário das Mudanças

### Fase 1 — Refatoração Arquitetural (base da branch)
1. [Reorganização da Estrutura de Pastas](#1-reorganização-da-estrutura-de-pastas)
2. [Providers viram Context (UserContext)](#2-providers-viram-context)
3. [Padronização de Nomenclatura](#3-padronização-de-nomenclatura)
4. [Enums fora dos Componentes](#4-enums-fora-dos-componentes)
5. [CSS e Styles unificados](#5-css-e-styles-unificados)
6. [Shared e Utils unificados](#6-shared-e-utils-unificados)
7. [Pasta axios/ e services/ unificadas em api/](#7-unificação-de-axiosservices-em-api)
8. [Separação de componentes das páginas](#8-separação-de-componentes-das-páginas)
9. [Limpeza de código](#9-limpeza-de-código)
10. [Migração de componentes UI básicos](#10-migração-de-componentes-ui-básicos)
11. [Hooks customizados (useModal, usePagination)](#11-hooks-customizados)
12. [Padronização dos Services + BaseService](#12-padronização-dos-services--baseservice)
13. [Centralização de utilitários](#13-centralização-de-utilitários)

### Fase 2 — Features e Otimizações
14. [Integração TanStack Query (React Query)](#14-integração-tanstack-query)
15. [Formulários Performáticos — React Hook Form + Zod](#15-react-hook-form--zod)

### Fase 3 — Correções de Bug
16. [Correções de Bug — ProdutoDetalhe.jsx](#16-correções-de-bug-produtodetalhe)
17. [Correção de Bug — Modal de Serviços sem Clientes](#17-correção-modal-de-serviços-sem-clientes)

---

## Fase 1 — Refatoração Arquitetural

Esta fase envolveu a reestruturação completa do projeto antes de adicionar novas features. O objetivo foi deixar o código organizado, previsível e fácil de manter para o time inteiro.

---

### 1. Reorganização da Estrutura de Pastas

**Antes:** a estrutura estava achatada e sem separação clara de responsabilidades:

```
src/
├── axios/          ← instância HTTP isolada em pasta própria
├── services/       ← services em pasta separada do axios
├── shared/         ← componentes misturados com utils
│   └── components/
│       └── pedidosServicosComponents/
├── utils/          ← utilitários espalhados
├── provider/       ← contexto de auth fora do padrão
└── pages/          ← páginas com componentes internos misturados
```

**Depois:**

```
src/
├── api/                   ← tudo relacionado à API em um só lugar
│   ├── client/
│   │   ├── Api.jsx        ← instância Axios
│   │   └── BaseService.js ← classe base dos services
│   └── services/          ← services de domínio
├── components/             ← componentes compartilhados organizados por categoria
│   ├── core/
│   ├── feedback/
│   ├── layout/
│   ├── overlay/
│   ├── stepper/
│   └── ui/
├── context/               ← contextos de estado global
├── hooks/                 ← hooks customizados reutilizáveis
├── pages/                 ← páginas com components/ internos
├── styles/                ← CSS centralizado
├── types/                 ← enums e tipos compartilhados
└── utils/                 ← utilitários centralizados
```

**Impacto:** qualquer desenvolvedor novo encontra o arquivo que procura sem precisar adivinhar onde está.

---

### 2. Providers viram Context

**Antes:** havia uma pasta `src/provider/` com um componente que espalhava `window.dispatchEvent` e `window.addEventListener` para comunicar dados do usuário entre Header e Perfil — um anti-pattern de comunicação via eventos globais.

**O problema do padrão antigo:**
```js
// No Perfil, para atualizar o Header após salvar:
window.dispatchEvent(new CustomEvent('updateHeaderUserInfo', { detail: { nome, email } }));

// No Header, para escutar:
window.addEventListener('updateHeaderUserInfo', (e) => { ... });
```

Isso criava acoplamento invisível entre componentes e era difícil de rastrear e testar.

**Depois:** criado `src/context/UserContext.jsx` — uma fonte única de verdade para o usuário autenticado, usando Context API do React. Qualquer componente que precise dos dados do usuário usa `useUser()`:

```jsx
const { user, login, logout, updatePhoto } = useUser();
// user = { id, name, email, photo, isAuthenticated }
```

- `login(data)` → persiste em sessionStorage + localStorage e atualiza o estado
- `logout()` → limpa tudo de uma vez
- `updatePhoto(base64)` → persiste foto no localStorage e atualiza o estado globalmente

Eliminados: `window.dispatchEvent`, `window.addEventListener`, leitura direta de `sessionStorage` espalhada pelos componentes.

---

### 3. Padronização de Nomenclatura

Aplicado um padrão consistente em todo o projeto:

| Tipo | Convenção | Exemplos |
|---|---|---|
| Componentes React | PascalCase | `ClienteFormModal.jsx`, `Header.jsx` |
| Hooks | camelCase com prefixo `use` | `useModal.js`, `usePagination.js` |
| Services | camelCase com sufixo `Service` | `pedidosService.js`, `agendamentosService.js` |
| Utilitários | camelCase | `formatters.js`, `masks.js` |
| Constantes | UPPER_SNAKE_CASE | `TipoPedido.PRODUTO`, `StatusAgendamento.PENDENTE` |
| Pastas de página | kebab-case | `pagina-inicial/`, `calendar-dashboard/` |

Antes havia mistura de padrões: `NovoPedidoModal.jsx` ao lado de `novoServico.jsx`, services como objetos literais misturados com classes, etc.

---

### 4. Enums fora dos Componentes

**Antes:** strings de status e tipos eram repetidas diretamente nos componentes:

```jsx
// Espalhado por vários arquivos:
if (pedido.status === 'Ativo') { ... }
if (pedido.tipo === 'PRODUTO') { ... }
if (agendamento.status === 'PENDENTE') { ... }
```

Se um valor mudasse no backend (ex: `'PENDENTE'` → `'EM_ESPERA'`), precisaria caçar todas as ocorrências manualmente.

**Depois:** criado `src/types/enums.js` com todos os valores congelados:

```js
export const TipoAgendamento = Object.freeze({
  ORCAMENTO: 'ORCAMENTO',
  SERVICO: 'SERVICO',
});

export const StatusAgendamento = Object.freeze({
  PENDENTE: 'PENDENTE',
  CONFIRMADO: 'CONFIRMADO',
  CANCELADO: 'CANCELADO',
  CONCLUIDO: 'CONCLUIDO',
});

export const TipoPedido = Object.freeze({
  PRODUTO: 'PRODUTO',
  SERVICO: 'SERVICO',
});

export const StatusPedido = Object.freeze({ ... });
export const StatusCliente = Object.freeze({ ... });
```

O `Object.freeze()` impede que os valores sejam alterados acidentalmente em tempo de execução.

---

### 5. CSS e Styles unificados

**Antes:** havia arquivos CSS espalhados em vários locais sem hierarquia clara:
- CSS global dentro de `src/` na raiz
- CSS de componentes em pastas soltas
- Variáveis de cores definidas em múltiplos lugares
- Tailwind sem organização de configuração

**Depois:** criada a estrutura `src/styles/`:

```
src/styles/
├── css/
│   └── colors.css      ← variáveis CSS globais de cor (--primary, --secondary, etc.)
└── global/
    ├── index.css        ← reset e estilos base globais
    └── tailwind.css     ← diretivas @tailwind e customizações
```

Cada componente que precisa de estilos específicos mantém seu `.css` próprio ao lado do `.jsx`, mas o CSS global é único e centralizado.

---

### 6. Shared e Utils unificados

**Antes:** havia duas pastas com funções utilitárias:
- `src/shared/` — continha componentes mas also funções utilitárias misturadas
- `src/utils/` — utilitários mas incompleto

Isso gerava confusão sobre onde adicionar uma nova função helper ou onde procurar uma existente.

**Depois:** `src/shared/` foi eliminada. Tudo foi redistribuído:
- **Componentes** → `src/components/` (organizados por categoria)
- **Funções utilitárias** → `src/utils/` (arquivo por domínio)
- **Hooks** → `src/hooks/` (pasta dedicada)

---

### 7. Unificação de axios/services em api/

**Antes:** o cliente HTTP e os services viviam em pastas separadas sem relação explícita:

```
src/
├── axios/
│   └── Api.jsx          ← instância Axios
└── services/
    ├── agendamentosService.js
    ├── dashboardService.js
    ├── pedidosService.js
    └── servicosService.js
```

Cada service importava o Axios com caminho relativo longo (`../../axios/Api`). Não havia um padrão de retorno — alguns retornavam `response.data` diretamente, outros retornavam o objeto `response` inteiro, outros retornavam `throw error`.

**Depois:** tudo centralizado em `src/api/`:

```
src/api/
├── client/
│   ├── Api.jsx           ← instância Axios com interceptors
│   └── BaseService.js    ← classe base padronizando retornos
└── services/             ← services de domínio
    ├── agendamentosService.js
    ├── dashboardService.js
    ├── pedidosService.js
    └── servicosService.js
```

Todos os imports se tornaram `import Api from '../../api/client/Api'` ou via alias `@api/client/Api`.

---

### 8. Separação de componentes das páginas

**Antes:** os modais e sub-componentes de cada página ficavam ou dentro do próprio arquivo da página (tudo em um `.jsx` gigante) ou na pasta genérica `src/shared/components/pedidosServicosComponents/`.

Resultado: arquivos de página com mais de 1000 linhas e componentes difíceis de encontrar.

**Depois:** cada página tem sua própria pasta `components/` interna:

```
src/pages/
├── pedidos/
│   ├── Pedidos.jsx
│   ├── PedidosList.jsx
│   └── components/
│       ├── NovoPedidoProdutoModal.jsx
│       ├── NovoPedidoServicoModal.jsx
│       ├── EditarPedidoModal.jsx
│       └── EditarServicoModal.jsx
├── clientes/
│   ├── Clientes.jsx
│   └── components/
│       └── ClienteFormModal.jsx
├── estoque/
│   ├── Estoque.jsx
│   ├── ProdutoDetalhe.jsx
│   └── components/
└── funcionarios/
    ├── Funcionarios.jsx
    └── components/
```

---

### 9. Limpeza de código

Removidos ao longo de toda a base de código:

- `console.log` de debug desnecessários (ex: `console.log("🔍 Navegando para estoque ID:", id)`)
- Imports não utilizados (identificados via ESLint)
- Comentários de código "desativado" que nunca seriam reativados (`// TODO` antigos, código comentado)
- Props não utilizadas em componentes
- Variáveis declaradas e nunca lidas
- Dependências duplicadas de `useEffect` (warnings do React)
- Funções inline redefinidas a cada render que poderiam ser `useCallback`

---

### 10. Migração de componentes UI básicos

**Antes:** componentes de interface básicos (botões, inputs, modais) eram reimplementados inline em cada página, gerando inconsistência visual e duplicação.

**Depois:** criada a pasta `src/components/ui/` com componentes reutilizáveis:

| Componente | Localização | Descrição |
|---|---|---|
| `Button` | `components/ui/Button/` | Botão com variantes (primary, secondary, danger) |
| `Input` | `components/ui/Input/` | Input estilizado com suporte a ícones e erro |
| `Modal` | `components/overlay/Modal/` | Modal base com Backdrop, fechar com Escape |
| `Toast` | `components/feedback/Toast/` | Notificações temporárias |
| `SkeletonLoader` | `components/feedback/Skeleton/` | Loading skeleton para listas |
| `CircularProgress` | `components/feedback/Progress/` | Indicador de progresso circular |
| `ErrorBoundary` | `components/core/` | Captura erros de render e exibe fallback |
| `ScrollToTop` | `components/core/` | Volta ao topo ao navegar entre páginas |

Todos seguem a mesma API de props, facilitando troca e manutenção.

---

### 11. Hooks customizados

**Antes:** lógica de paginação e controle de modais era reimplementada em cada página com múltiplos `useState`:

```jsx
// Em cada página que tinha modal:
const [modalAberto, setModalAberto] = useState(false);
const [modalEditar, setModalEditar] = useState(false);
const [modalConfirm, setModalConfirm] = useState(false);

// Em cada página com lista:
const [pagina, setPagina] = useState(1);
const itensPorPagina = 10;
const inicio = (pagina - 1) * itensPorPagina;
const fim = inicio + itensPorPagina;
const itensPaginados = lista.slice(inicio, fim);
const totalPaginas = Math.ceil(lista.length / itensPorPagina);
```

**Depois:** criados hooks reutilizáveis em `src/hooks/`:

#### `useModal(keys)`
```js
const { modal, open, close, closeAll } = useModal(['novo', 'editar', 'confirm']);

open('novo')           // abre o modal 'novo'
close('editar')        // fecha o modal 'editar'
closeAll()             // fecha todos
modal.novo             // boolean — está aberto?
// Bonus: pressionar Escape chama closeAll() automaticamente
```

#### `usePagination(items, itemsPerPage)`
```js
const { page, paginated, totalPages, next, prev, startIndex, endIndex } = usePagination(lista, 10);
// paginated → array com apenas os itens da página atual
// Corrige automaticamente a página quando os dados são filtrados
```

---

### 12. Padronização dos Services + BaseService

**Antes:** cada service tinha seu próprio padrão de retorno:

```js
// dashboardService.js — retornava o objeto response do Axios diretamente
export const getQtdItensCriticos = () => {
  return Api.get('/dashboard/qtd-itens-criticos'); // ← retorna Promise<AxiosResponse>
};

// agendamentosService.js — lançava exceção
getAll: async () => {
  const response = await Api.get('/agendamentos');
  return response.data; // ← retorna só data, sem controle de erro
};

// Um modal de pedido — fazia fetch direto sem nenhum service
const response = await Api.post('/pedidos', data);
```

Componentes precisavam saber qual padrão cada service usava para consumir corretamente.

**Depois:** criado `src/api/client/BaseService.js` — todos os services estendem essa classe:

```js
class BaseService {
  constructor(api) {
    this.api = api;
  }

  // Normaliza QUALQUER resposta Axios para o mesmo formato
  async _handle(promise) {
    try {
      const response = await promise;
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message ?? error.message ?? 'Erro desconhecido',
        status: error.response?.status,
      };
    }
  }

  get(url, config)         { return this._handle(this.api.get(url, config)); }
  post(url, data, config)  { return this._handle(this.api.post(url, data, config)); }
  put(url, data, config)   { return this._handle(this.api.put(url, data, config)); }
  delete(url, config)      { return this._handle(this.api.delete(url, config)); }
}
```

Agora **todo** service retorna `{ success, data, error, status }`. Os componentes verificam `success` e pronto — sem try/catch em quem consome, sem surpresas.

---

### 13. Centralização de utilitários

**Antes:** funções de formatação eram implementadas inline dentro dos componentes ou copiadas entre arquivos:

```jsx
// Em um componente qualquer:
const formatarMoeda = (val) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const formatarTelefone = (tel) => tel.replace(/(d{2})(d{5})(d{4})/, '($1) $2-$3');
```

Implementações diferentes do mesmo formatador espalhadas pelo projeto causavam inconsistência.

**Depois:** todos os utilitários centralizados em `src/utils/`:

#### `formatters.js` — formatação de dados para exibição
```js
formatCurrency(1234.56)  // → "R$ 1.234,56"
parseCurrency("R$ 1.234,56")  // → 1234.56
formatPhone("11999998888")    // → "(11) 99999-8888"
formatDate("2026-02-22")      // → "22/02/2026"
formatDateTime(isoString)     // → "22/02/2026 às 14:30"
```

#### `masks.js` — máscaras dinâmicas para inputs
```js
cpfMask("12345678900")    // → "123.456.789-00"
phoneMask("11999998888")  // → "(11) 99999-8888"
cepMask("01310100")       // → "01310-100"
onlyLetters("João123")    // → "João"
removeMask("123.456.789-00")  // → "12345678900"
```

#### `cn.js` — classes CSS condicionais
```js
// Combina clsx (classes condicionais) + tailwind-merge (resolve conflitos Tailwind)
cn("px-4 py-2", isActive && "bg-blue-500", "bg-red-500")
// → "px-4 py-2 bg-red-500" (tailwind-merge remove bg-blue-500 em favor de bg-red-500)
```

#### `animation.js` — variants do Framer Motion reutilizáveis
Variants padronizados de fade, slide e scale para manter animações consistentes em toda a aplicação.

---

## Fase 2 — Features e Otimizações

---

### 14. Integração TanStack Query

> *Continuação da documentação de features — ver resto do arquivo.*

## 14. Integração TanStack Query

### O que era antes

Cada página buscava dados manualmente com o padrão:

```jsx
const [dados, setDados] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  MinhaService.buscar()
    .then(res => setDados(res.data))
    .finally(() => setLoading(false));
}, []);
```

**Problemas desse padrão:**
- Sem cache: toda troca de aba ou remontagem do componente disparava nova requisição
- Sem controle de erros padronizado
- Loading state manual e repetitivo em cada página
- Impossível invalidar dados de forma coordenada (ex: ao salvar um pedido, o dashboard não sabia que precisava atualizar)

### O que fizemos

Instalamos e configuramos o **TanStack Query v5** como camada de gerenciamento de dados assíncronos.

**Pacotes instalados:**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

---

### Arquivos criados

#### `src/lib/queryClient.js`
Instância única (singleton) do QueryClient com configurações padrão sensatas:

```js
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,           // dados servidos do cache por 1 minuto sem nova requisição
      gcTime: 300_000,             // dados removidos da memória após 5 minutos sem uso
      retry: 1,                    // tenta 1 vez a mais antes de exibir erro
      refetchOnWindowFocus: false, // não re-busca ao trocar de aba
    },
    mutations: { retry: 0 },
  },
});
```

---

#### `src/api/queryKeys.js`
Factory centralizada de query keys hierárquicas. Evita strings soltas espalhadas pelo código e permite invalidações precisas por escopo:

```js
queryKeys.dashboard.all()        // ['dashboard']
queryKeys.pedidos.all()          // ['pedidos']
queryKeys.pedidos.produtos()     // ['pedidos', 'produtos']
queryKeys.pedidos.detail(id)     // ['pedidos', 'detalhe', id]
queryKeys.agendamentos.all()     // ['agendamentos']
```

**Por que isso importa:** quando criamos um pedido novo, chamamos `queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all() })` e automaticamente todos os dados de pedidos são considerados desatualizados — sem precisar chamar `refetch()` manualmente em cada lugar.

---

#### `src/hooks/queries/useDashboard.js`
Hooks individuais para cada KPI da página inicial + um hook agregado:

| Hook | Endpoint |
|---|---|
| `useQtdAgendamentosHoje()` | `/dashboard/agendamentos/hoje` |
| `useQtdAgendamentosFuturos()` | `/dashboard/agendamentos/futuros/count` |
| `useAgendamentosFuturos()` | `/dashboard/agendamentos/futuros` |
| `useItensCriticos()` | `/dashboard/estoque/critico` |
| `useQtdItensCriticos()` | `/dashboard/estoque/critico/count` |
| `useTaxaOcupacaoServicos()` | `/dashboard/servicos/taxa-ocupacao` |
| **`useDashboardKpis()`** | **Agrega todos os hooks acima** |

---

#### `src/hooks/queries/useAgendamentos.js`
Hooks para operações de agendamentos:

- `useAgendamentos()` — lista todos os agendamentos
- `useAgendamento(id)` — busca um agendamento por ID
- `useCriarAgendamento()` — mutation que invalida agendamentos + dashboard ao ser bem-sucedida
- `useAtualizarAgendamento()` — idem
- `useDeletarAgendamento()` — idem

---

#### `src/hooks/queries/usePedidos.js`
Hooks para operações de pedidos:

- `usePedidosProduto()` — lista pedidos de produto, com mapeamento `mapearParaFrontend()` e ordenação por ID decrescente
- `usePedidosServico()` — lista pedidos de serviço
- `usePedido(id)` — busca pedido por ID
- `useCriarPedido()` — mutation com invalidação automática
- `useAtualizarPedido()` — idem
- `useDeletarPedido()` — idem
- `useDeletarServico()` — idem

---

### Arquivos modificados

#### `src/App.jsx`
Envolvemos toda a aplicação com o `QueryClientProvider` e adicionamos o `ReactQueryDevtools` (visível apenas em desenvolvimento):

```jsx
<QueryClientProvider client={queryClient}>
  <UserProvider>
    <RouterProvider router={appRouter} />
  </UserProvider>
  {import.meta.env.DEV && (
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  )}
</QueryClientProvider>
```

O ReactQueryDevtools é um painel que aparece no canto inferior direito durante o desenvolvimento, mostrando todas as queries, seu status (fresh, stale, fetching, error) e os dados em cache.

---

#### `src/pages/pagina-inicial/PaginaInicial.jsx`
**Antes:** 6 `useState` + 1 `useEffect` com `Promise.all` manual para os KPIs.

**Depois:**
```jsx
const {
  qtdAgendamentosHoje,
  qtdAgendamentosFuturos,
  agendamentosFuturos,
  itensCriticos,
  taxaOcupacaoServicos,
  qtdItensCriticos,
  isLoading: loading,
} = useDashboardKpis();
```

Removidos: 6 imports de service, `useState` ×6, `useEffect`, lógica de try/catch manual.

---

#### `src/pages/pedidos/PedidosList.jsx`
**Antes:** `useState` + `fetchData()` + `useEffect` com chamada direta ao service.

**Depois:**
```jsx
const { data: pedidos = [], isLoading: loading, isError, error, refetch } = usePedidosProduto();
const deletarMutation = useDeletarPedido();
```

Benefícios: cache automático, exibição de erro com botão de re-tentativa, invalidação automática após deletar.

---

#### `src/hooks/index.js` e `src/api/index.js`
Adicionados barrel exports para os novos hooks e queryKeys.

---

## 15. React Hook Form + Zod

### O que era antes

Os formulários usavam `useState` controlado — cada tecla digitada disparava um re-render do componente inteiro:

```jsx
const [formData, setFormData] = useState({ nome: '', cpf: '', ... });

<input
  value={formData.nome}
  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
/>
```

A validação era manual com if/else encadeados, sem tipagem e fácil de desincronizar.

### O que fizemos

Instalamos **React Hook Form** (formulários com _uncontrolled components_) e **Zod** (validação de schema):

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Diferença principal:** com RHF, os inputs NÃO são controlados pelo React — eles gerenciam seu próprio estado interno no DOM. O React só é notificado nos momentos certos (submit, blur, etc.), eliminando re-renders a cada tecla.

---

### Arquivos criados

#### `src/lib/schemas.js`
Todos os schemas Zod centralizados em um único arquivo:

| Schema | Uso |
|---|---|
| `clienteSchema` | Formulário de cliente (nome, CPF, telefone, e-mail, endereço completo) |
| `enderecoSchema` | Sub-schema reutilizável de endereço |
| `pedidoProdutoEtapa0Schema` | Validação da etapa "Cliente" no modal de pedido de produto |
| `pedidoProdutoEtapa1Schema` | Validação da etapa "Produtos" |
| `pedidoProdutoEtapa2Schema` | Validação da etapa "Pagamento" |
| `pedidoServicoEtapa0/1/2Schema` | Equivalentes para pedidos de serviço |
| `zodFirstError(error)` | Helper: extrai a primeira mensagem de erro de um `ZodError` |

**Exemplo de schema:**
```js
const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().transform(v => v.replace(/\D/g, '')).refine(v => v.length === 11, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  status: z.enum(['Ativo', 'Inativo', 'Avulso']),
  // ...
});
```

O `.transform()` no CPF remove a máscara antes de validar — o valor salvo no banco sempre chega sem formatação.

---

#### `src/components/ui/Form/FormField.jsx`
Componente genérico de campo compatível com React Hook Form:

```jsx
<FormField
  id="nome"
  label="Nome Completo"
  required
  registration={register('nome')}
  error={errors.nome}
/>
```

Exibe automaticamente a mensagem de erro abaixo do campo com estilo vermelho quando há falha de validação.

---

### Arquivos modificados

#### `src/pages/clientes/components/ClienteFormModal.jsx`
Reescrita completa do formulário de 428 linhas. Mudanças principais:

- `useForm({ resolver: zodResolver(clienteSchema), mode: 'onBlur' })` — valida ao sair do campo
- Campos com máscara (CPF, telefone, CEP) usam `Controller` para integrar o `IMaskInput` com o RHF
- Consulta de CEP usa `setValue()` do RHF para preencher os campos automaticamente
- Botão de submit fica `disabled` durante o envio, prevenindo duplo clique
- Props externas inalteradas: `{ open, onClose, onSubmit, modoEdicao, clienteInicial }`

---

#### `src/pages/pedidos/components/NovoPedidoProdutoModal.jsx`
Substituída a validação manual por etapa (bloco de if/else com 45+ linhas) por Zod:

**Antes:**
```js
const validateStep = () => {
  if (!formData.tipoCliente) { setError('Selecione o tipo de cliente'); return false; }
  if (formData.tipoCliente === 'novo' && !formData.clienteNome) { setError('Nome obrigatório'); return false; }
  // ... mais 20 condições
};
```

**Depois:**
```js
const validateStep = () => {
  const schemas = [etapa0Schema, etapa1Schema, etapa2Schema];
  const result = schemas[currentStep]?.safeParse(formData);
  if (!result?.success) {
    setError(zodFirstError(result.error));
    return false;
  }
  return true;
};
```

---

#### `src/pages/pedidos/components/NovoPedidoServicoModal.jsx`
Mesma mudança de `validateStep` aplicada ao modal de serviços, usando os schemas `pedidoServicoEtapa0/1/2Schema`.

---

## 16. Correções de Bug — ProdutoDetalhe

### O erro

Ao clicar no ícone de olho em qualquer produto na página de Estoque, a aplicação travava com:

```
ReferenceError: get is not defined
    at fetchData (ProdutoDetalhe.jsx:43)
```

### A causa

O arquivo `ProdutoDetalhe.jsx` inteiro estava corrompido — o operador de acesso a propriedades `.` (ponto) havia sido substituído por `/` (divisão) em dezenas de lugares. Isso fazia o JavaScript interpretar `Api/get(url)` como "divida `Api` pela variável `get`", que não existe.

**Exemplo do problema:**
```js
// Como estava (ERRADO):
const response = await Api/get(`/estoque/${id}`);
if (response/status === 200) {
  setEstoque(response/data);
}

// Como ficou (CORRETO):
const response = await Api.get(`/estoque/${id}`);
if (response.status === 200) {
  setEstoque(response.data);
}
```

### Todas as ocorrências corrigidas

Foram realizadas quatro rodadas de busca e substituição, cobrindo mais de 25 ocorrências em todo o arquivo:

| Linha(s) | Errado | Correto |
|---|---|---|
| 43 | `Api/get(url)` | `Api.get(url)` |
| 88–260 | `Api/put(url)` ×6 | `Api.put(url)` ×6 |
| 72 | `estoqueResponse/status` | `estoqueResponse.status` |
| 73 | `estoqueResponse/data` | `estoqueResponse.data` |
| 75 | `historicoResponse/status` | `historicoResponse.status` |
| 76–80 | `historicoData/sort`, `/map`, `/length`, `/reverse` | versões com `.` |
| 82 | `hist/dataHora` | `hist.dataHora` |
| ~300 | `estoque/produto` | `estoque.produto` |
| ~301 | `produto/metrica` | `produto.metrica` |
| ~302–304 | `estoque/quantidadeTotal`, `/quantidadeDisponivel`, `/reservado` | versões com `.` |
| ~307 | `metrica/nivelMinimo` | `metrica.nivelMinimo` |
| ~223 | `estoque/produto/atributos/filter` | `estoque.produto.atributos.filter` |
| 479, 484 | `produto/ativo` ×2 (em JSX className) | `produto.ativo` ×2 |
| 264 | `e/target/value` | `e.target.value` |
| 544 | `produto/atributos`, `/map` | `produto.atributos.map` |
| 552, 562 | `e/target/value` ×2 (em atributos) | `e.target.value` ×2 |
| 672 | `movimento/dataHora`, `/toLocaleDateString` | versões com `.` |
| 679 | `gap-1/5` (Tailwind), `movimento/tipoMovimentacao` | `gap-1.5`, `movimento.tipoMovimentacao` |
| 692 | `movimento/tipoMovimentacao` | `movimento.tipoMovimentacao` |

---

## 17. Correção — Modal de Serviços sem Clientes

### O erro

Na página de Pedidos, ao abrir a aba de **Serviços** e tentar criar um novo pedido, o dropdown de "Cliente Existente" aparecia vazio, mesmo com clientes cadastrados no banco. A aba de **Produtos** funcionava normalmente.

### A causa

O arquivo `NovoPedidoServicoModal.jsx` tinha um bloqueio no início da função `carregarDados()`:

```js
const carregarDados = async () => {
  // Verificar se existe token antes de fazer as chamadas
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    console.warn("Token não encontrado, pulando carregamento de dados");
    return; // ← SEMPRE caia aqui e não carregava nada
  }
  // ...
};
```

O problema: o app **nunca armazena** nenhuma chave chamada `"accessToken"` no `sessionStorage`. As chaves usadas são `isAuthenticated`, `userId`, `userName`, etc. Portanto, `sessionStorage.getItem("accessToken")` sempre retornava `null`, o guard sempre bloqueava, e os clientes nunca eram buscados.

O modal de **Produtos** nunca teve esse guard, por isso funcionava.

### A correção

Removido o guard desnecessário. A função agora segue o mesmo padrão do modal de produtos:

```js
const carregarDados = async () => {
  try {
    const clientes = await buscarClientes();
    setClientesExistentes(Array.isArray(clientes) ? clientes : []);
    setServicosDisponiveis([]);
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    setClientesExistentes([]);
  }
};
```

---

## Resumo de Arquivos Alterados (Fase 2 e 3)

### Arquivos criados (novos)
| Arquivo | Descrição |
|---|---|
| `src/lib/queryClient.js` | Singleton do QueryClient com configurações padrão |
| `src/api/queryKeys.js` | Factory centralizada de query keys |
| `src/hooks/queries/useDashboard.js` | Hooks de KPIs do dashboard |
| `src/hooks/queries/useAgendamentos.js` | Hooks de agendamentos (queries + mutations) |
| `src/hooks/queries/usePedidos.js` | Hooks de pedidos (queries + mutations) |
| `src/hooks/queries/index.js` | Barrel export dos hooks de query |
| `src/lib/schemas.js` | Todos os schemas Zod centralizados |
| `src/components/ui/Form/FormField.jsx` | Campo genérico compatível com React Hook Form |

### Arquivos modificados
| Arquivo | O que mudou |
|---|---|
| `src/App.jsx` | Adicionado QueryClientProvider + ReactQueryDevtools |
| `src/hooks/index.js` | Re-exporta hooks de query |
| `src/api/index.js` | Re-exporta queryKeys |
| `src/pages/pagina-inicial/PaginaInicial.jsx` | Migrado para `useDashboardKpis()` |
| `src/pages/pedidos/PedidosList.jsx` | Migrado para `usePedidosProduto()` + `useDeletarPedido()` |
| `src/pages/clientes/components/ClienteFormModal.jsx` | Reescrita completa com RHF + Zod |
| `src/pages/pedidos/components/NovoPedidoProdutoModal.jsx` | `validateStep` substituído por Zod |
| `src/pages/pedidos/components/NovoPedidoServicoModal.jsx` | `validateStep` por Zod + correção do bug de clientes |
| `src/pages/estoque/ProdutoDetalhe.jsx` | Correção de ~25 ocorrências de `/` no lugar de `.` |

---

## Dependências Adicionadas (Fase 2)

```json
"@tanstack/react-query": "^5.90.21",
"@tanstack/react-query-devtools": "^5.91.3",
"react-hook-form": "^7.71.2",
"zod": "^4.3.6",
"@hookform/resolvers": "^5.2.2"
```

---

## Como testar as mudanças

1. **TanStack Query DevTools**: após fazer login, procure o logo do TanStack no canto inferior direito da tela. Clique para abrir o painel de cache — você verá todas as queries ativas, seus dados e status.

2. **Formulário de Clientes**: na página de Clientes, abra o formulário de criação. Tente clicar em "Salvar" sem preencher nada — os erros de validação aparecem campo a campo, ao sair de cada input.

3. **Pedidos de Serviço**: na página de Pedidos, clique em "Novo Pedido" > aba Serviços. O dropdown de "Cliente Existente" deve listar os clientes cadastrados.

4. **Detalhe do Estoque**: na página de Estoque, clique no ícone de olho de qualquer produto. A página de detalhe deve abrir sem erros, mostrando gráfico e histórico de movimentações.
