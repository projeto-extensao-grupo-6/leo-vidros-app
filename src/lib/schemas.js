import { z } from 'zod';

const cpfRaw = z
  .string()
  .optional()
  .transform((v) => (v ? v.replace(/\D/g, '') : ''))
  .refine((v) => v === '' || v.length === 11, { message: 'CPF inválido' });

const telefoneRaw = z
  .string()
  .optional()
  .transform((v) => (v ? v.replace(/\D/g, '') : ''));

const cepRaw = z
  .string()
  .optional()
  .transform((v) => (v ? v.replace(/\D/g, '') : ''))
  .refine((v) => v === '' || v.length === 8, { message: 'CEP inválido' });

const ufField = z
  .string()
  .max(2, 'UF deve ter no máximo 2 caracteres')
  .optional()
  .default('');

export const enderecoSchema = z.object({
  cep: cepRaw,
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.union([z.string(), z.number()]).optional().default(''),
  complemento: z.string().optional().default(''),
  bairro: z.string().optional().default(''),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  uf: ufField,
  pais: z.string().optional().default('Brasil'),
});

export const enderecoOpcionalSchema = z.object({
  cep: cepRaw,
  rua: z.string().optional().default(''),
  numero: z.union([z.string(), z.number()]).optional().default(''),
  complemento: z.string().optional().default(''),
  bairro: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  uf: ufField,
  pais: z.string().optional().default('Brasil'),
});

export const clienteSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  cpf: cpfRaw,
  contato: telefoneRaw,
  email: z
    .string()
    .email('Email inválido')
    .or(z.literal(''))
    .optional()
    .default(''),
  status: z.enum(['Ativo', 'Inativo']).default('Inativo'),
  cep: cepRaw,
  rua: z.string().optional().default(''),
  numero: z.union([z.string(), z.number()]).optional().default(''),
  complemento: z.string().optional().default(''),
  bairro: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  uf: ufField,
});

export const clientePayloadSchema = clienteSchema.transform((data) => ({
  nome: data.nome,
  cpf: data.cpf || undefined,
  email: data.email || undefined,
  telefone: data.contato || undefined,
  status: data.status,
  enderecos: [
    {
      cep: data.cep,
      rua: data.rua,
      numero: data.numero ? Number(data.numero) : undefined,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      pais: 'Brasil',
    },
  ],
}));

export const pedidoProdutoEtapa0Schema = z
  .object({
    tipoCliente: z.enum(['existente', 'novo', 'nenhum']),
    clienteId: z.union([z.string(), z.number()]).optional(),
    clienteNome: z.string().optional().default(''),
    clienteTelefone: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.tipoCliente === 'existente' && !data.clienteId) {
      ctx.addIssue({ path: ['clienteId'], code: z.ZodIssueCode.custom, message: 'Selecione um cliente' });
    }
    if (data.tipoCliente === 'novo') {
      if (!data.clienteNome?.trim()) {
        ctx.addIssue({ path: ['clienteNome'], code: z.ZodIssueCode.custom, message: 'Nome do cliente é obrigatório' });
      }
      if (!data.clienteTelefone?.trim()) {
        ctx.addIssue({ path: ['clienteTelefone'], code: z.ZodIssueCode.custom, message: 'Telefone do cliente é obrigatório' });
      }
    }
  });

const itemProdutoSchema = z.object({
  produtoId: z.union([z.string(), z.number()]).refine((v) => v !== '' && v !== 0, {
    message: 'Selecione um produto',
  }),
  nome: z.string().optional().default(''),
  quantidade: z.number({ coerce: true }).min(1, 'Quantidade deve ser maior que zero'),
  preco: z.number({ coerce: true }).min(0, 'Preço inválido'),
  subtotal: z.number({ coerce: true }).optional().default(0),
});

export const pedidoProdutoEtapa1Schema = z.object({
  produtos: z
    .array(itemProdutoSchema)
    .min(1, 'Adicione pelo menos um produto'),
});

export const pedidoProdutoEtapa2Schema = z.object({
  formaPagamento: z.string().min(1, 'Selecione uma forma de pagamento'),
});

export const pedidoServicoEtapa0Schema = z
  .object({
    tipoCliente: z.enum(['existente', 'novo', 'nenhum']),
    clienteId: z.union([z.string(), z.number()]).optional(),
    clienteNome: z.string().optional().default(''),
    clienteTelefone: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.tipoCliente === 'existente' && !data.clienteId) {
      ctx.addIssue({ path: ['clienteId'], code: z.ZodIssueCode.custom, message: 'Selecione um cliente' });
    }
    if (data.tipoCliente === 'novo') {
      if (!data.clienteNome?.trim()) {
        ctx.addIssue({ path: ['clienteNome'], code: z.ZodIssueCode.custom, message: 'Nome do cliente é obrigatório' });
      }
      if (!data.clienteTelefone?.trim()) {
        ctx.addIssue({ path: ['clienteTelefone'], code: z.ZodIssueCode.custom, message: 'Telefone do cliente é obrigatório' });
      }
    }
    if (data.tipoCliente === 'nenhum' && !data.clienteNome?.trim()) {
      ctx.addIssue({ path: ['clienteNome'], code: z.ZodIssueCode.custom, message: 'Nome para identificação é obrigatório' });
    }
  });

export const pedidoServicoEtapa1Schema = z.object({
  endereco: z.object({
    rua: z.string().min(1, 'Endereço é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    cep: z.string().optional().default(''),
    numero: z.union([z.string(), z.number()]).optional().default(''),
    complemento: z.string().optional().default(''),
    bairro: z.string().optional().default(''),
    uf: z.string().max(2).optional().default(''),
  }),
});

const itemServicoSchema = z.object({
  nome: z.string().min(1, 'Nome do serviço é obrigatório'),
  descricao: z.string().optional().default(''),
  precoEstimado: z.number({ coerce: true }).min(0).optional().default(0),
  observacoes: z.string().optional().default(''),
});

export const pedidoServicoEtapa2Schema = z.object({
  servicos: z
    .array(itemServicoSchema)
    .min(1, 'Adicione pelo menos um serviço'),
});

export const zodFirstError = (zodError) =>
  zodError.errors[0]?.message ?? 'Dados inválidos';
