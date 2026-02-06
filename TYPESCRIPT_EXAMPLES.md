# Exemplos de Uso - TypeScript

## 📚 Guia Prático de Uso dos Novos Recursos

### 1. Usando Services

#### Exemplo Básico - Buscar Todos os Clientes
```typescript
import { clientesService } from '@/services';

// Em um componente ou função
const buscarClientes = async () => {
  const response = await clientesService.getAll();
  
  if (response.success) {
    console.log('Clientes:', response.data);
    // response.data é Cliente[] (tipado automaticamente!)
  } else {
    console.error('Erro:', response.error);
  }
};
```

#### Exemplo - Buscar Cliente por ID
```typescript
import { clientesService } from '@/services';

const buscarCliente = async (id: number) => {
  const response = await clientesService.getById(id);
  
  if (response.success && response.data) {
    const cliente = response.data; // Tipo: Cliente
    console.log(`Nome: ${cliente.nome}`);
    console.log(`Email: ${cliente.email}`);
    console.log(`CPF: ${cliente.cpf}`);
  }
};
```

#### Exemplo - Criar Novo Cliente
```typescript
import { clientesService } from '@/services';
import type { Cliente } from '@/core/types/models.types';

const criarCliente = async () => {
  const novoCliente: Partial<Cliente> = {
    nome: "João Silva",
    email: "joao@email.com",
    cpf: "12345678900",
    telefone: "(11) 98765-4321",
    ativo: true
  };
  
  const response = await clientesService.create(novoCliente);
  
  if (response.success) {
    console.log('Cliente criado:', response.data);
  } else {
    console.error('Erro:', response.error);
  }
};
```

#### Exemplo - Atualizar Cliente
```typescript
import { clientesService } from '@/services';

const atualizarCliente = async (id: number) => {
  const dadosAtualizados = {
    email: "novoemail@email.com",
    telefone: "(11) 91234-5678"
  };
  
  const response = await clientesService.update(id, dadosAtualizados);
  
  if (response.success) {
    console.log('Cliente atualizado:', response.data);
  }
};
```

#### Exemplo - Deletar Cliente
```typescript
import { clientesService } from '@/services';

const deletarCliente = async (id: number) => {
  const response = await clientesService.delete(id);
  
  if (response.success) {
    console.log('Cliente deletado com sucesso');
  }
};
```

### 2. Usando Formatadores

#### Formatação de Moeda
```typescript
import { formatCurrency, parseCurrency } from '@/utils/formatters';

// Formatar para exibição
const preco = 1234.56;
console.log(formatCurrency(preco)); // "R$ 1.234,56"

// Aceita string também
console.log(formatCurrency("1234.56")); // "R$ 1.234,56"

// Valores null/undefined
console.log(formatCurrency(null)); // "R$ 0,00"

// Converter string formatada para número
const valorString = "R$ 1.234,56";
const valor = parseCurrency(valorString); // 1234.56
```

#### Formatação de Telefone
```typescript
import { formatPhone, unformatPhone, isValidPhone } from '@/utils/formatters';

// Formatar telefone
const tel = "11987654321";
console.log(formatPhone(tel)); // "(11) 98765-4321"

// Telefone fixo
const fixo = "1134567890";
console.log(formatPhone(fixo)); // "(11) 3456-7890"

// Remover formatação
const formatted = "(11) 98765-4321";
console.log(unformatPhone(formatted)); // "11987654321"

// Validar telefone
console.log(isValidPhone("11987654321")); // true
console.log(isValidPhone("123")); // false
```

#### Formatação de Data
```typescript
import { 
  formatDate, 
  formatDateTime, 
  formatDateLong,
  formatRelativeDate 
} from '@/utils/formatters';

const data = new Date("2024-01-15T14:30:00");

console.log(formatDate(data)); // "15/01/2024"
console.log(formatDateTime(data)); // "15/01/2024 14:30"
console.log(formatDateLong(data)); // "15 de janeiro de 2024"

// Data relativa
const ontem = new Date();
ontem.setDate(ontem.getDate() - 1);
console.log(formatRelativeDate(ontem)); // "há 1 dia"
```

### 3. Usando Validadores

#### Validação de CPF
```typescript
import { isValidCPF, formatCPF, unformatCPF } from '@/utils/validators';

// Validar
console.log(isValidCPF("12345678900")); // true/false
console.log(isValidCPF("123.456.789-00")); // true/false (aceita formatado)

// Formatar
const cpf = "12345678900";
console.log(formatCPF(cpf)); // "123.456.789-00"

// Remover formatação
const cpfFormatado = "123.456.789-00";
console.log(unformatCPF(cpfFormatado)); // "12345678900"
```

#### Validação de Email
```typescript
import { isValidEmail, isValidEmailStrict, normalizeEmail } from '@/utils/validators';

// Validação básica
console.log(isValidEmail("usuario@email.com")); // true
console.log(isValidEmail("invalido")); // false

// Validação rigorosa
console.log(isValidEmailStrict("teste@dominio.com.br")); // true

// Normalizar
const email = "  USUARIO@EMAIL.COM  ";
console.log(normalizeEmail(email)); // "usuario@email.com"
```

#### Validações Comuns
```typescript
import { 
  isNotEmpty, 
  hasMinLength, 
  hasMaxLength,
  isStrongPassword,
  passwordsMatch 
} from '@/utils/validators';

// Campo não vazio
console.log(isNotEmpty("texto")); // true
console.log(isNotEmpty("")); // false
console.log(isNotEmpty(null)); // false

// Tamanho mínimo
console.log(hasMinLength("senha123", 8)); // true
console.log(hasMinLength("abc", 8)); // false

// Senha forte
console.log(isStrongPassword("Senha@123")); // true
console.log(isStrongPassword("fraca")); // false

// Comparar senhas
const senha = "MinhaS3nha!";
const confirmacao = "MinhaS3nha!";
console.log(passwordsMatch(senha, confirmacao)); // true
```

### 4. Service com Métodos Customizados

#### Exemplo - EstoqueService
```typescript
import { estoqueService } from '@/services';

// Buscar produto
const produto = await estoqueService.buscarProdutoPorId(123);

// Registrar entrada
const entrada = await estoqueService.registrarEntrada(
  123,  // produtoId
  50,   // quantidade
  "Compra de fornecedor"  // observacoes
);

// Registrar saída
const saida = await estoqueService.registrarSaida(
  123,
  10,
  "Venda para cliente"
);

// Buscar histórico
const historico = await estoqueService.buscarHistorico(123);

// Produtos com estoque baixo
const baixo = await estoqueService.buscarEstoqueBaixo(10);
```

#### Exemplo - ServicosService
```typescript
import { servicosService } from '@/services';

// Buscar todos os serviços
const response = await servicosService.buscarTodos();
if (response.success) {
  const servicos = response.data; // ServicoMapeado[]
  console.log(`Total: ${servicos.length} serviços`);
}

// Buscar por etapa
const emAndamento = await servicosService.buscarPorEtapa("Execução em andamento");

// Filtrar serviços
const servicos = response.data!;
const filtrados = servicosService.filtrarServicos(servicos, {
  status: "Ativo",
  etapa: "Aguardando orçamento",
  busca: "João"
});

// Obter opções para dropdowns
const etapas = servicosService.getEtapasDisponiveis();
const statusOptions = servicosService.getStatusDisponiveis();
```

### 5. Exemplo de Componente React com TypeScript

```typescript
import { useState, useEffect } from 'react';
import { clientesService } from '@/services';
import type { Cliente } from '@/core/types/models.types';
import { formatCurrency, formatPhone } from '@/utils/formatters';
import { isValidEmail } from '@/utils/validators';

interface ClienteFormProps {
  clienteId?: number;
  onSave?: (cliente: Cliente) => void;
}

const ClienteForm = ({ clienteId, onSave }: ClienteFormProps) => {
  const [cliente, setCliente] = useState<Partial<Cliente>>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    ativo: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clienteId) {
      carregarCliente(clienteId);
    }
  }, [clienteId]);

  const carregarCliente = async (id: number) => {
    setLoading(true);
    const response = await clientesService.getById(id);
    
    if (response.success && response.data) {
      setCliente(response.data);
    }
    setLoading(false);
  };

  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cliente.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!cliente.email || !isValidEmail(cliente.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    const response = clienteId
      ? await clientesService.update(clienteId, cliente)
      : await clientesService.create(cliente);

    if (response.success && response.data) {
      onSave?.(response.data);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={cliente.nome}
        onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
        placeholder="Nome"
      />
      {errors.nome && <span className="error">{errors.nome}</span>}

      <input
        type="email"
        value={cliente.email}
        onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
};

export default ClienteForm;
```

### 6. Exemplo de Hook Customizado

```typescript
import { useState, useEffect } from 'react';
import { clientesService } from '@/services';
import type { Cliente } from '@/core/types/models.types';
import type { ApiResponse } from '@/core/types/api.types';

interface UseClientesResult {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  buscarPorId: (id: number) => Promise<Cliente | null>;
}

export const useClientes = (): UseClientesResult => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);

    const response = await clientesService.getAll();

    if (response.success && response.data) {
      setClientes(response.data);
    } else {
      setError(response.error || 'Erro ao carregar clientes');
    }

    setLoading(false);
  };

  const buscarPorId = async (id: number): Promise<Cliente | null> => {
    const response = await clientesService.getById(id);
    return response.success && response.data ? response.data : null;
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    refresh: carregarClientes,
    buscarPorId
  };
};

// Uso em componente:
// const { clientes, loading, error, refresh } = useClientes();
```

### 7. Trabalhando com Tipos Genéricos

```typescript
import { BaseService } from '@/core/services/BaseService';
import type { ApiResponse } from '@/core/types/api.types';

// Criar um service customizado
interface MeuTipoCustomizado {
  id: number;
  nome: string;
  valor: number;
}

class MeuServiceCustomizado extends BaseService<MeuTipoCustomizado> {
  constructor() {
    super('/meu-endpoint');
  }

  // Método customizado
  async buscarPorNome(nome: string): Promise<ApiResponse<MeuTipoCustomizado[]>> {
    return this.customGet<MeuTipoCustomizado[]>('/buscar', { nome });
  }

  // Outro método customizado
  async calcularTotal(): Promise<ApiResponse<{ total: number }>> {
    return this.customGet<{ total: number }>('/total');
  }
}

export const meuService = new MeuServiceCustomizado();
```

## 🎯 Dicas Importantes

### 1. Sempre Use os Path Aliases
```typescript
// ✅ Bom
import { clientesService } from '@/services';

// ❌ Ruim
import { clientesService } from '../../../services/clientesService';
```

### 2. Verifique Sempre response.success
```typescript
const response = await clientesService.getAll();

// ✅ Bom
if (response.success && response.data) {
  console.log(response.data);
}

// ❌ Ruim - pode dar erro
console.log(response.data.length);
```

### 3. Use Optional Chaining
```typescript
// ✅ Bom
const nome = cliente?.nome ?? 'Sem nome';

// ❌ Ruim
const nome = cliente && cliente.nome ? cliente.nome : 'Sem nome';
```

### 4. Defina Tipos para Props
```typescript
// ✅ Bom
interface MinhaProps {
  titulo: string;
  onClick?: () => void;
}

const MeuComponente = ({ titulo, onClick }: MinhaProps) => {
  // ...
};

// ❌ Ruim
const MeuComponente = ({ titulo, onClick }) => {
  // ...
};
```
