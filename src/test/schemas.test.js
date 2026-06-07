import { describe, it, expect } from 'vitest'
import {
  clienteSchema,
  clienteAvulsoSchema,
  enderecoSchema,
  enderecoOpcionalSchema,
  pedidoProdutoEtapa0Schema,
  pedidoProdutoEtapa1Schema,
  pedidoProdutoEtapa2Schema,
  pedidoServicoEtapa0Schema,
  pedidoServicoEtapa1Schema,
  pedidoServicoEtapa2Schema,
  zodFirstError,
} from '../lib/schemas.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const parseSuccess = (schema, value) => schema.safeParse(value)
const parseError   = (schema, value) => schema.safeParse(value)

// Base valid cliente payload used throughout clienteSchema tests
const validCliente = {
  nome: 'João Silva',
  cpf: '529.982.247-25',
  contato: '(11) 99999-9999',
  email: 'joao@email.com',
  status: 'Ativo',
  cep: '01310-100',
  rua: 'Rua das Flores',
  numero: '10',
  complemento: '',
  bairro: 'Centro',
  cidade: 'São Paulo',
  uf: 'SP',
}

// ---------------------------------------------------------------------------
// cpfRequired (tested via clienteSchema.shape.cpf)
// Zod v4: .transform().refine() — safeParse operates on pre-transform input
// ---------------------------------------------------------------------------
describe('cpfRequired (via clienteSchema)', () => {
  it('aceita CPF válido com máscara', () => {
    const result = parseSuccess(clienteSchema, validCliente)
    expect(result.success).toBe(true)
  })

  it('aceita CPF válido sem máscara', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, cpf: '52998224725' })
    expect(result.success).toBe(true)
  })

  it('transforma CPF removendo não-dígitos ao parsear', () => {
    const result = parseSuccess(clienteSchema, validCliente)
    expect(result.success).toBe(true)
    // após transform, cpf deve ser apenas dígitos
    expect(result.data.cpf).toBe('52998224725')
  })

  it('rejeita CPF com todos os dígitos iguais (000.000.000-00)', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '000.000.000-00' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF com todos os dígitos iguais (111.111.111-11)', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '111.111.111-11' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF com dígitos verificadores errados', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '123.456.789-00' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF vazio (obrigatório)', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF muito curto', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF muito longo', () => {
    const result = parseError(clienteSchema, { ...validCliente, cpf: '123456789012' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// telefoneRequired (tested via clienteSchema.shape.contato)
// ---------------------------------------------------------------------------
describe('telefoneRequired (via clienteSchema)', () => {
  it('aceita telefone com 10 dígitos (fixo)', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, contato: '1133334444' })
    expect(result.success).toBe(true)
  })

  it('aceita telefone com 11 dígitos (celular)', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, contato: '11999999999' })
    expect(result.success).toBe(true)
  })

  it('aceita telefone formatado com máscara (11 dígitos)', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, contato: '(11) 99999-9999' })
    expect(result.success).toBe(true)
  })

  it('rejeita telefone muito curto (menos de 10 dígitos)', () => {
    const result = parseError(clienteSchema, { ...validCliente, contato: '119999' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone muito longo (mais de 11 dígitos)', () => {
    const result = parseError(clienteSchema, { ...validCliente, contato: '119999999991' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone vazio (obrigatório)', () => {
    const result = parseError(clienteSchema, { ...validCliente, contato: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// cepRequired (tested via clienteSchema.shape.cep)
// ---------------------------------------------------------------------------
describe('cepRequired (via clienteSchema)', () => {
  it('aceita CEP válido com 8 dígitos', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, cep: '01310100' })
    expect(result.success).toBe(true)
  })

  it('aceita CEP formatado com máscara', () => {
    const result = parseSuccess(clienteSchema, { ...validCliente, cep: '01310-100' })
    expect(result.success).toBe(true)
  })

  it('rejeita CEP com menos de 8 dígitos', () => {
    const result = parseError(clienteSchema, { ...validCliente, cep: '0131' })
    expect(result.success).toBe(false)
  })

  it('rejeita CEP com mais de 8 dígitos', () => {
    const result = parseError(clienteSchema, { ...validCliente, cep: '013101000' })
    expect(result.success).toBe(false)
  })

  it('rejeita CEP vazio (obrigatório)', () => {
    const result = parseError(clienteSchema, { ...validCliente, cep: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// cepRaw (optional CEP — via enderecoSchema)
// ---------------------------------------------------------------------------
describe('cepRaw (via enderecoSchema — opcional)', () => {
  const validEndereco = {
    cep: '',
    rua: 'Rua A',
    numero: '1',
    complemento: '',
    bairro: '',
    cidade: 'São Paulo',
    uf: 'SP',
    pais: 'Brasil',
  }

  it('aceita CEP vazio (campo opcional)', () => {
    const result = parseSuccess(enderecoSchema, validEndereco)
    expect(result.success).toBe(true)
  })

  it('aceita CEP undefined (campo opcional)', () => {
    const result = parseSuccess(enderecoSchema, { ...validEndereco, cep: undefined })
    expect(result.success).toBe(true)
  })

  it('aceita CEP válido com 8 dígitos', () => {
    const result = parseSuccess(enderecoSchema, { ...validEndereco, cep: '01310100' })
    expect(result.success).toBe(true)
  })

  it('rejeita CEP com dígitos insuficientes (não vazio e não 8 dígitos)', () => {
    const result = parseError(enderecoSchema, { ...validEndereco, cep: '1234' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// enderecoOpcionalSchema
// ---------------------------------------------------------------------------
describe('enderecoOpcionalSchema', () => {
  it('aceita objeto completamente vazio (todos opcionais)', () => {
    const result = parseSuccess(enderecoOpcionalSchema, {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      pais: '',
    })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// clienteAvulsoSchema
// ---------------------------------------------------------------------------
describe('clienteAvulsoSchema', () => {
  it('aceita cliente avulso apenas com nome', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria' })
    expect(result.success).toBe(true)
  })

  it('rejeita nome muito curto', () => {
    const result = parseError(clienteAvulsoSchema, { nome: 'A' })
    expect(result.success).toBe(false)
  })

  it('aceita CPF opcional vazio', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria', cpf: '' })
    expect(result.success).toBe(true)
  })

  it('aceita CPF válido com 11 dígitos', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria', cpf: '52998224725' })
    expect(result.success).toBe(true)
  })

  it('rejeita CPF com comprimento errado (não vazio, não 11 dígitos)', () => {
    const result = parseError(clienteAvulsoSchema, { nome: 'Maria', cpf: '12345' })
    expect(result.success).toBe(false)
  })

  it('aceita telefone opcional vazio', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria', contato: '' })
    expect(result.success).toBe(true)
  })

  it('aceita telefone com 10 dígitos', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria', contato: '1133334444' })
    expect(result.success).toBe(true)
  })

  it('aceita telefone com 11 dígitos', () => {
    const result = parseSuccess(clienteAvulsoSchema, { nome: 'Maria', contato: '11999999999' })
    expect(result.success).toBe(true)
  })

  it('rejeita telefone com comprimento errado', () => {
    const result = parseError(clienteAvulsoSchema, { nome: 'Maria', contato: '11999' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoProdutoEtapa0Schema
// ---------------------------------------------------------------------------
describe('pedidoProdutoEtapa0Schema', () => {
  it('aceita tipoCliente=nenhum sem clienteId', () => {
    const result = parseSuccess(pedidoProdutoEtapa0Schema, { tipoCliente: 'nenhum' })
    expect(result.success).toBe(true)
  })

  it('aceita tipoCliente=existente com clienteId fornecido', () => {
    const result = parseSuccess(pedidoProdutoEtapa0Schema, { tipoCliente: 'existente', clienteId: 1 })
    expect(result.success).toBe(true)
  })

  it('rejeita tipoCliente=existente sem clienteId', () => {
    const result = parseError(pedidoProdutoEtapa0Schema, { tipoCliente: 'existente' })
    expect(result.success).toBe(false)
  })

  it('aceita tipoCliente=novo com nome e telefone', () => {
    const result = parseSuccess(pedidoProdutoEtapa0Schema, {
      tipoCliente: 'novo',
      clienteNome: 'Carlos',
      clienteTelefone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita tipoCliente=novo sem nome', () => {
    const result = parseError(pedidoProdutoEtapa0Schema, {
      tipoCliente: 'novo',
      clienteNome: '',
      clienteTelefone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita tipoCliente=novo sem telefone', () => {
    const result = parseError(pedidoProdutoEtapa0Schema, {
      tipoCliente: 'novo',
      clienteNome: 'Carlos',
      clienteTelefone: '',
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoProdutoEtapa1Schema
// ---------------------------------------------------------------------------
describe('pedidoProdutoEtapa1Schema', () => {
  const validItem = { produtoId: 1, nome: 'Vidro', quantidade: 2, preco: 100 }

  it('aceita lista com pelo menos um produto válido', () => {
    const result = parseSuccess(pedidoProdutoEtapa1Schema, { produtos: [validItem] })
    expect(result.success).toBe(true)
  })

  it('rejeita lista vazia', () => {
    const result = parseError(pedidoProdutoEtapa1Schema, { produtos: [] })
    expect(result.success).toBe(false)
  })

  it('rejeita produto com quantidade zero', () => {
    const result = parseError(pedidoProdutoEtapa1Schema, {
      produtos: [{ ...validItem, quantidade: 0 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejeita produto com preço negativo', () => {
    const result = parseError(pedidoProdutoEtapa1Schema, {
      produtos: [{ ...validItem, preco: -1 }],
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoProdutoEtapa2Schema
// ---------------------------------------------------------------------------
describe('pedidoProdutoEtapa2Schema', () => {
  it('aceita forma de pagamento válida', () => {
    const result = parseSuccess(pedidoProdutoEtapa2Schema, { formaPagamento: 'PIX' })
    expect(result.success).toBe(true)
  })

  it('rejeita forma de pagamento vazia', () => {
    const result = parseError(pedidoProdutoEtapa2Schema, { formaPagamento: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoServicoEtapa0Schema
// ---------------------------------------------------------------------------
describe('pedidoServicoEtapa0Schema', () => {
  it('aceita tipoCliente=nenhum com clienteNome fornecido', () => {
    const result = parseSuccess(pedidoServicoEtapa0Schema, {
      tipoCliente: 'nenhum',
      clienteNome: 'Identificação',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita tipoCliente=nenhum sem clienteNome', () => {
    const result = parseError(pedidoServicoEtapa0Schema, {
      tipoCliente: 'nenhum',
      clienteNome: '',
    })
    expect(result.success).toBe(false)
  })

  it('aceita tipoCliente=existente com clienteId', () => {
    const result = parseSuccess(pedidoServicoEtapa0Schema, {
      tipoCliente: 'existente',
      clienteId: 5,
    })
    expect(result.success).toBe(true)
  })

  it('rejeita tipoCliente=existente sem clienteId', () => {
    const result = parseError(pedidoServicoEtapa0Schema, { tipoCliente: 'existente' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoServicoEtapa1Schema
// ---------------------------------------------------------------------------
describe('pedidoServicoEtapa1Schema', () => {
  it('aceita endereço com rua e cidade', () => {
    const result = parseSuccess(pedidoServicoEtapa1Schema, {
      endereco: { rua: 'Rua X', numero: '5', cidade: 'BH' },
    })
    expect(result.success).toBe(true)
  })

  it('rejeita endereço sem rua', () => {
    const result = parseError(pedidoServicoEtapa1Schema, {
      endereco: { rua: '', cidade: 'BH' },
    })
    expect(result.success).toBe(false)
  })

  it('rejeita endereço sem cidade', () => {
    const result = parseError(pedidoServicoEtapa1Schema, {
      endereco: { rua: 'Rua X', cidade: '' },
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// pedidoServicoEtapa2Schema
// ---------------------------------------------------------------------------
describe('pedidoServicoEtapa2Schema', () => {
  const validServico = { nome: 'Instalação', descricao: '', precoEstimado: 500 }

  it('aceita lista com pelo menos um serviço', () => {
    const result = parseSuccess(pedidoServicoEtapa2Schema, { servicos: [validServico] })
    expect(result.success).toBe(true)
  })

  it('rejeita lista vazia', () => {
    const result = parseError(pedidoServicoEtapa2Schema, { servicos: [] })
    expect(result.success).toBe(false)
  })

  it('rejeita serviço sem nome', () => {
    const result = parseError(pedidoServicoEtapa2Schema, {
      servicos: [{ ...validServico, nome: '' }],
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// zodFirstError helper
// ---------------------------------------------------------------------------
describe('zodFirstError', () => {
  it('extrai a primeira mensagem de erro de um ZodError com issues', () => {
    const result = clienteSchema.safeParse({ ...validCliente, cpf: '' })
    expect(result.success).toBe(false)
    const msg = zodFirstError(result.error)
    expect(typeof msg).toBe('string')
    expect(msg.length).toBeGreaterThan(0)
  })

  it('retorna fallback quando não há issues', () => {
    const msg = zodFirstError({})
    expect(msg).toBe('Dados invalidos')
  })
})
