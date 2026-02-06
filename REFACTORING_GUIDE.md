# 📚 Guia de Refatoração e Migração TypeScript

## 🎉 ATUALIZAÇÃO: Projeto Migrado para TypeScript!

> **Status**: ✅ Migração TypeScript completa com sucesso!
> 
> O projeto agora possui type safety completo, autocomplete inteligente e validação em tempo de desenvolvimento.
> 
> **Ver documentação detalhada**: 
> - [`TYPESCRIPT_MIGRATION.md`](./TYPESCRIPT_MIGRATION.md) - Resumo da migração
> - [`TYPESCRIPT_EXAMPLES.md`](./TYPESCRIPT_EXAMPLES.md) - Exemplos práticos de uso

---

## 📦 Nova Estrutura (TypeScript)

```
src/
├── core/                          # Núcleo da aplicação (TypeScript)
│   ├── api/
│   │   └── axios.config.ts       # ✨ Axios tipado com interceptors
│   │
│   ├── services/
│   │   └── BaseService.ts        # ✨ Service genérico com tipos
│   │
│   └── types/                    # ✨ NOVO: Definições de tipos
│       ├── api.types.ts          # ApiResponse<T>, PaginationParams
│       ├── models.types.ts       # Cliente, Produto, Pedido, etc.
│       └── index.ts
│
├── shared/
│   ├── utils/
│   │   ├── formatters/           # ✨ Formatadores tipados
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   ├── phone.ts
│   │   │   └── index.ts
│   │   │
│   │   └── validators/           # ✨ Validadores tipados
│   │       ├── cpf.ts
│   │       ├── email.ts
│   │       ├── cep.ts
│   │       ├── phone.ts
│   │       ├── common.ts
│   │       └── index.ts
│   │
│   └── components/               # Componentes organizados
│       ├── ui/                   # Componentes de interface
│       ├── layout/               # Layouts (Header, Sidebar)
│       ├── feedback/             # Loading, Errors
│       └── common/               # Comuns (Icons, Images)
│
├── features/                     # ✨ Componentes por domínio
│   ├── clientes/
│   ├── estoque/
│   ├── pedidos/
│   └── funcionarios/
│
└── services/                     # ✨ Services tipados
    ├── agendamentosService.ts
    ├── clientesService.ts
    ├── funcionariosService.ts
    ├── estoqueService.ts
    ├── produtosService.ts
    ├── pedidosService.ts
    ├── servicosService.ts
    ├── dashboardService.ts
    └── index.ts
```

---

## 🎯 Como Usar (TypeScript)

### **1. Formatadores**

```typescript
// ✅ JEITO NOVO (TypeScript)
import { formatCurrency, formatDate, formatPhone } from '@/utils/formatters';

// Formatar moeda - totalmente tipado!
const preco = 1234.56;
formatCurrency(preco);  // "R$ 1.234,56"
const preco = formatCurrency(1234.56);
// Resultado: "R$ 1.234,56"

// Formatar data
const data = formatDate('2024-01-15');
// Resultado: "15/01/2024"

// Formatar telefone
const telefone = formatPhone('11987654321');
// Resultado: "(11) 98765-4321"

// Formatar data e hora
const dataHora = formatDateTime('2024-01-15T14:30:00');
// Resultado: "15/01/2024 14:30"

// Converter moeda para número
const valor = parseCurrency("R$ 1.234,56");
// Resultado: 1234.56
```

```javascript
// ❌ JEITO ANTIGO (Evitar)
const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "R$ 0,00";
  return `R$ ${parseFloat(value).toFixed(2).replace(".", ",")}`;
};
```

---

### **2. Validadores**

```javascript
// ✅ JEITO NOVO (Recomendado)
import { isValidCPF, isValidEmail, isValidPhone, onlyLetters } from '@/shared/utils/validators';

// Validar CPF
if (isValidCPF('123.456.789-00')) {
  console.log('CPF válido');
}

// Validar email
if (isValidEmail('user@example.com')) {
  console.log('Email válido');
}

// Validar telefone
if (isValidPhone('(11) 98765-4321')) {
  console.log('Telefone válido');
}

// Filtrar apenas letras
const nome = onlyLetters('João123'); 
// Resultado: "João"

// Validar senha forte
if (isStrongPassword('Senha123')) {
  console.log('Senha forte');
}
```

---

### **3. Services com BaseService**

```javascript
// ✅ JEITO NOVO (Recomendado)
import { clientesService } from '@/services';

// Buscar todos os clientes
const fetchClientes = async () => {
  const response = await clientesService.getAll();
  
  if (response.success) {
    console.log('Clientes:', response.data);
  } else {
    console.error('Erro:', response.error);
  }
};

// Buscar cliente por ID
const fetchCliente = async (id) => {
  const response = await clientesService.getById(id);
  
  if (response.success) {
    console.log('Cliente:', response.data);
  }
};

// Criar novo cliente
const criarCliente = async (dados) => {
  const response = await clientesService.create(dados);
  
  if (response.success) {
    console.log('Cliente criado:', response.data);
  }
};

// Atualizar cliente
const atualizarCliente = async (id, dados) => {
  const response = await clientesService.update(id, dados);
  
  if (response.success) {
    console.log('Cliente atualizado');
  }
};

// Deletar cliente
const deletarCliente = async (id) => {
  const response = await clientesService.delete(id);
  
  if (response.success) {
    console.log('Cliente deletado');
  }
};
```

```javascript
// ❌ JEITO ANTIGO (Evitar)
import Api from '../../axios/Api';

const fetchClientes = async () => {
  try {
    const response = await Api.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
```

---

### **4. Services Específicos**

```javascript
// Agendamentos
import { agendamentosService } from '@/services';

// Buscar agendamentos de hoje
const agendamentosHoje = await agendamentosService.getToday();

// Buscar agendamentos futuros
const agendamentosFuturos = await agendamentosService.getFuture();

// Atualizar status
await agendamentosService.updateStatus(id, 'confirmado');
```

```javascript
// Estoque
import { estoqueService } from '@/services';

// Buscar itens com estoque baixo
const estoq ueBaixo = await estoqueService.getLowStock();

// Registrar entrada
await estoqueService.registrarEntrada(produtoId, {
  quantidade: 10,
  data: new Date(),
  motivo: 'Reposição'
});

// Inativar produto
await estoqueService.inativar(produtoId);
```

---

## 🔄 Migração Gradual

### **Passo 1: Atualizar imports dos formatadores**

```javascript
// ANTES
const formatCurrency = (value) => { /* código duplicado */ };

// DEPOIS
import { formatCurrency } from '@/shared/utils/formatters';
```

### **Passo 2: Usar validadores centralizados**

```javascript
// ANTES
const isValidCPF = (cpf) => { /* código duplicado */ };

// DEPOIS
import { isValidCPF } from '@/shared/utils/validators';
```

### **Passo 3: Migrar services para usar BaseService**

```javascript
// ANTES
const buscarTodos = async () => {
  try {
    const response = await Api.get('/endpoint');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DEPOIS
import { serviceNameService } from '@/services';
const response = await serviceNameService.getAll();
```

---

## ✨ Benefícios

- ✅ **Código centralizado**: Funções em um único lugar
- ✅ **Menos duplicação**: Reutilização de código
- ✅ **Manutenção fácil**: Altere uma vez, aplica em todos os lugares
- ✅ **Padrão consistente**: Todos os services seguem o mesmo padrão
- ✅ **TypeScript-ready**: Estrutura preparada para TypeScript
- ✅ **Testável**: Fácil criar testes unitários

---

## 📝 Próximos Passos

1. ✅ Utilitários centralizados criados
2. ✅ BaseService implementado
3. ✅ Services padronizados criados
4. ⏳ Atualizar componentes para usar novos utilitários
5. ⏳ Remover código duplicado
6. ⏳ Criar custom hooks reutilizáveis
