import { z } from "zod";
import { isValidCPF, removeMask } from "../../utils/masks";
import { 
  CONTRATO_TIPOS, 
  TURNOS,
  AGENDAMENTO_STATUS,
  PEDIDO_STATUS 
} from "../../core/constants";

/**
 * Schemas de validação com Zod para formulários
 */

// Validações customizadas
const cpfValidation = z
  .string()
  .min(1, "CPF é obrigatório")
  .refine((value) => {
    const cleanCPF = removeMask(value);
    return cleanCPF.length === 11;
  }, "CPF deve ter 11 dígitos")
  .refine((value) => {
    const cleanCPF = removeMask(value);
    return isValidCPF(cleanCPF);
  }, "CPF inválido");

const phoneValidation = z
  .string()
  .min(1, "Telefone é obrigatório")
  .refine((value) => {
    const cleanPhone = removeMask(value);
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }, "Telefone inválido");

const cepValidation = z
  .string()
  .min(1, "CEP é obrigatório")
  .refine((value) => {
    const cleanCEP = removeMask(value);
    return cleanCEP.length === 8;
  }, "CEP deve ter 8 dígitos");

const emailValidation = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email inválido");

const nameValidation = z
  .string()
  .min(1, "Nome é obrigatório")
  .min(3, "Nome deve ter no mínimo 3 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras");

// Schema para Cliente
export const clienteSchema = z.object({
  nome: nameValidation,
  cpf: cpfValidation,
  email: emailValidation,
  telefone: phoneValidation,
  cep: cepValidation.optional().or(z.literal("")),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  dataNascimento: z.string().optional(),
  observacoes: z.string().optional(),
});

// Schema para Funcionário
export const funcionarioSchema = z.object({
  nome: nameValidation,
  cpf: cpfValidation,
  email: emailValidation,
  telefone: phoneValidation,
  cargo: z.string().min(1, "Cargo é obrigatório"),
  salario: z
    .string()
    .min(1, "Salário é obrigatório")
    .refine((value) => {
      const numero = parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
      return numero > 0;
    }, "Salário deve ser maior que zero"),
  dataContratacao: z.string().min(1, "Data de contratação é obrigatória"),
  tipoContrato: z.enum([CONTRATO_TIPOS.REGISTRADO, CONTRATO_TIPOS.FIXO, CONTRATO_TIPOS.TEMPORARIO], {
    errorMap: () => ({ message: "Tipo de contrato inválido" }),
  }),
  turno: z.enum([TURNOS.MANHA, TURNOS.TARDE, TURNOS.NOITE, TURNOS.INTEGRAL], {
    errorMap: () => ({ message: "Turno inválido" }),
  }),
  ativo: z.boolean().optional(),
  imagem: z.string().optional(),
});

// Schema para Produto (Estoque)
export const produtoSchema = z.object({
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  quantidade: z
    .number()
    .min(0, "Quantidade não pode ser negativa")
    .or(z.string().regex(/^\d+$/, "Quantidade deve ser um número")),
  preco: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((value) => {
      const numero = parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
      return numero > 0;
    }, "Preço deve ser maior que zero"),
  fornecedor: z.string().optional(),
  descricao: z.string().optional(),
  unidade: z.string().optional(),
});

// Schema para Login
export const loginSchema = z.object({
  email: emailValidation,
  senha: z.string().min(1, "Senha é obrigatória").min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Schema para Esqueceu Senha
export const esqueceuSenhaSchema = z.object({
  email: emailValidation,
});

// Schema para Nova Senha
export const novaSenhaSchema = z
  .object({
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirmação deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não correspondem",
    path: ["confirmarSenha"],
  });

// Schema para Agendamento
export const agendamentoSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  servicoId: z.string().min(1, "Serviço é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  horario: z.string().min(1, "Horário é obrigatório"),
  observacoes: z.string().optional(),
  status: z.enum([AGENDAMENTO_STATUS.PENDENTE, AGENDAMENTO_STATUS.CONFIRMADO, AGENDAMENTO_STATUS.CANCELADO, AGENDAMENTO_STATUS.CONCLUIDO]).optional(),
});

