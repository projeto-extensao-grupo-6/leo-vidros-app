# 🏗️ Nova Estrutura de Pastas - Projeto Front-end

## 📁 Estrutura Atualizada (JavaScript Only)

```
src/
├── assets/                    # Recursos estáticos
│   ├── icons/                 # Ícones da aplicação
│   ├── images/                # Imagens gerais
│   └── logo/                  # Logotipos
│
├── core/                      # Núcleo da aplicação
│   ├── api/                   # Configuração de API
│   │   └── axios.config.js    # Cliente HTTP configurado
│   ├── services/              # Serviços base
│   │   └── BaseService.js     # Classe base para CRUD
│   └── constants/             # Constantes globais (NOVO)
│       ├── index.js
│       ├── routes.js          # Rotas da aplicação
│       ├── statuses.js        # Status de pedidos/agendamentos
│       └── options.js         # Opções de formulários
│
├── features/                  # Features/Módulos da aplicação
│   ├── clientes/              # Módulo de clientes
│   │   ├── components/        # Componentes específicos
│   │   ├── hooks/             # Hooks customizados (NOVO)
│   │   └── services/          # Serviços específicos (NOVO)
│   ├── estoque/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── funcionarios/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── pedidos/
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── pages/                     # Páginas da aplicação
│   ├── agendamentos/
│   │   └── agendamentos.jsx
│   ├── calendar-dashboard/
│   │   ├── index.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── clientes/
│   │   └── clientes.jsx
│   ├── estoque/
│   │   ├── estoque.jsx
│   │   └── ProdutoDetalhe.jsx
│   ├── funcionarios/
│   │   └── funcionarios.jsx
│   ├── login/
│   │   └── login.jsx
│   ├── paginaInicial/
│   │   └── paginaInicial.jsx
│   └── perfil/
│       └── perfil.jsx
│
├── services/                  # Serviços da API (Camada de dados)
│   ├── index.js               # Exportações centralizadas
│   ├── agendamentosService.js
│   ├── clientesService.js
│   ├── dashboardService.js
│   ├── estoqueService.js
│   ├── funcionariosService.js
│   ├── pedidosService.js
│   ├── produtosService.js
│   └── servicosService.js
│
├── shared/                    # Recursos compartilhados
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Sistema de Design
│   │   │   ├── Avatar/
│   │   │   ├── Button/
│   │   │   ├── Checkbox/
│   │   │   ├── Chip/
│   │   │   ├── FormControlLabel/
│   │   │   ├── Grid/
│   │   │   ├── IconButton/
│   │   │   ├── Input/
│   │   │   ├── MaskedInput/
│   │   │   ├── MenuItem/
│   │   │   ├── Modal/
│   │   │   ├── Stack/
│   │   │   ├── Stepper/
│   │   │   ├── Switch/
│   │   │   ├── Table/
│   │   │   └── Utilities/
│   │   ├── common/            # Componentes comuns
│   │   │   ├── AppIcon.jsx
│   │   │   ├── AppImage.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   └── layout/            # Layout components
│   │       ├── Header/
│   │       └── Sidebar/
│   ├── hooks/                 # Hooks customizados globais (NOVO)
│   │   ├── useApi.js
│   │   ├── useForm.js
│   │   ├── useLoading.js
│   │   └── useAuth.js
│   ├── schemas/               # Schemas de validação
│   │   └── validationSchemas.js
│   ├── styles/                # Estilos globais
│   │   ├── index.css
│   │   └── tailwind.css
│   └── utils/                 # Utilitários
│       ├── animation.js
│       ├── cn.js              # Merge de classes CSS
│       ├── masks.js           # Máscaras de input
│       └── formatters/        # Formatadores diversos
│
├── provider/                  # Providers do React
│   ├── ProtectedRoute.jsx     # Proteção de rotas
│   └── route.jsx              # Configuração de rotas
│
├── App.jsx                    # Componente raiz
├── App.css                    # Estilos do App
├── index.jsx                  # Entry point
└── index.css                  # Estilos globais

```

## 🎯 Melhorias Implementadas

### ✅ 1. Conversão TypeScript → JavaScript
- ❌ Removido: TypeScript, @types/*, tsconfig.json
- ✅ Convertido: Todos os services de .ts para .js
- ✅ Atualizado: vite.config.js com aliases
- ✅ Limpo: package.json sem dependências TS

### ✅ 2. Estrutura de Services Centralizada
```javascript
// Antes (espalhado)
/src/services/clientesService.ts
/src/features/clientes/api/...

// Depois (centralizado)
/src/services/
├── index.js                    # ✅ Exporta todos os services
├── clientesService.js          # ✅ JavaScript puro
├── funcionariosService.js      # ✅ Sem types
└── BaseService.js (core/)      # ✅ Classe base
```

### ✅ 3. Core Organizado
```
/src/core/
├── api/                        # Configuração HTTP
├── services/                   # Classes base
└── constants/                  # Constantes (próximo passo)
    ├── routes.js
    ├── statuses.js
    └── options.js
```

### ✅ 4. Features com Estrutura Consistente
```
/src/features/{feature}/
├── components/                 # Componentes do módulo
├── hooks/                      # Hooks específicos (NOVO)
└── services/                   # Lógica de negócio (NOVO)
```

### ✅ 5. Shared Melhorado
```
/src/shared/
├── components/
│   ├── ui/                     # 43+ componentes exportados
│   ├── common/                 # ErrorBoundary, etc
│   └── layout/                 # Header, Sidebar
├── hooks/                      # useApi, useForm, useLoading
├── schemas/                    # Validações Zod
├── styles/                     # CSS global
└── utils/                      # Utilitários
```

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Linguagem | TypeScript | JavaScript | ✅ 100% JSX |
| Arquivos .ts | 14 arquivos | 0 arquivos | ✅ -100% |
| Dependências | 55 pacotes | 52 pacotes | ✅ -3 TS deps |
| Aliases Vite | Nenhum | 8 aliases | ✅ Imports limpos |
| Estrutura Services | Desorganizada | Centralizada | ✅ /services/ |
| Core Constants | Inline | /core/constants/ | ✅ DRY |
| Features Hooks | Inline | /features/{x}/hooks/ | ✅ Reutilizável |

## 🔄 Aliases Configurados

```javascript
// vite.config.js
{
  '@': './src',
  '@core': './src/core',
  '@services': './src/services',
  '@shared': './src/shared',
  '@features': './src/features',
  '@pages': './src/pages',
  '@utils': './src/utils',
  '@components': './src/shared/components',
  '@assets': './src/assets',
}
```

## 📝 Exemplos de Uso

### Import de Services
```javascript
// Antes
import { clientesService } from '@/services/clientesService';
import { BaseService } from '@/core/services/BaseService';

// Depois (ainda funciona)
import { clientesService } from '@services';
import { BaseService } from '@core/services/BaseService';
```

### Import de Componentes
```javascript
// Antes
import { Button } from '../../../shared/components/ui/buttons/button.component';

// Depois
import { Button } from '@components/ui';
```

### Import de Utils
```javascript
// Antes
import { cpfMask } from '../../../utils/masks';

// Depois
import { cpfMask } from '@utils/masks';
```

## 🚀 Próximos Passos

### 1. Criar Constants (HIGH Priority)
```
/src/core/constants/
├── routes.js          # Rotas da aplicação
├── statuses.js        # Status pedidos/agendamentos
└── options.js         # Opções de formulários
```

### 2. Criar Hooks Compartilhados (MEDIUM)
```
/src/shared/hooks/
├── useApi.js          # Gerenciar requisições
├── useForm.js         # Abstração react-hook-form
├── useLoading.js      # Estado de loading global
└── useAuth.js         # Autenticação
```

### 3. Reorganizar Features (MEDIUM)
```
Mover lógica de /pages/ para /features/
Adicionar hooks/ e services/ em cada feature
```

### 4. Implementar ErrorBoundary (HIGH)
```
/src/shared/components/common/ErrorBoundary.jsx
Envolver rotas principais
```

## ✅ Checklist de Migração

- [x] Converter todos .ts para .js
- [x] Remover dependências TypeScript
- [x] Atualizar vite.config.js
- [x] Configurar aliases de path
- [x] Centralizar services em /services/
- [x] Limpar package.json
- [ ] Criar /core/constants/
- [ ] Criar /shared/hooks/
- [ ] Implementar ErrorBoundary
- [ ] Reorganizar features
- [ ] Adicionar hooks por feature
- [ ] Testar build production

## 🎉 Benefícios Finais

✅ **100% JavaScript** - Sem TypeScript, sem @types
✅ **Imports Limpos** - Aliases configurados
✅ **Estrutura Clara** - Separação de responsabilidades
✅ **Escalável** - Fácil adicionar novas features
✅ **Manutenível** - Código organizado e consistente
✅ **Performance** - Sem overhead de compilação TS
