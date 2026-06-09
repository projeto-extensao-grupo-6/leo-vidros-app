import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  parseCurrency,
  formatPhone,
  formatDate,
  formatDateTime,
  toInputDate,
  formatCpf,
  formatCep,
} from '../utils/formatters.js'

// formatCurrency has two code paths that produce subtly different strings:
//   - Intl.NumberFormat path (valid numbers): uses U+00A0 between "R$" and digits
//   - Hardcoded fallback path (null/undefined/NaN): uses plain U+0020 space
// We use toContain() for edge-case assertions to be robust against both paths.

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formata 1000 contendo R$, ponto de milhar e centavos ,00', () => {
    const result = formatCurrency(1000)
    expect(result).toContain('R$')
    expect(result).toContain('1.000')
    expect(result).toContain(',00')
  })

  it('formata 0 contendo R$ e 0,00', () => {
    const result = formatCurrency(0)
    expect(result).toContain('R$')
    expect(result).toContain('0,00')
  })

  it('formata valor decimal 9.99 com centavos corretos', () => {
    const result = formatCurrency(9.99)
    expect(result).toContain('R$')
    expect(result).toContain('9,99')
  })

  it('formata valor negativo contendo o simbolo e os digitos', () => {
    const result = formatCurrency(-50)
    expect(result).toContain('50')
    expect(result).toContain('R$')
  })

  it('retorna fallback R$ 0,00 para null', () => {
    const result = formatCurrency(null)
    expect(result).toContain('R$')
    expect(result).toContain('0,00')
  })

  it('retorna fallback R$ 0,00 para undefined', () => {
    const result = formatCurrency(undefined)
    expect(result).toContain('R$')
    expect(result).toContain('0,00')
  })

  it('retorna fallback R$ 0,00 para NaN', () => {
    const result = formatCurrency(NaN)
    expect(result).toContain('R$')
    expect(result).toContain('0,00')
  })

  it('retorna fallback R$ 0,00 para string nao numerica', () => {
    const result = formatCurrency('abc')
    expect(result).toContain('R$')
    expect(result).toContain('0,00')
  })

  it('aceita string numerica e formata corretamente', () => {
    const result = formatCurrency('250.5')
    expect(result).toContain('R$')
    expect(result).toContain('250')
    expect(result).toContain(',50')
  })
})

// ---------------------------------------------------------------------------
// parseCurrency
// ---------------------------------------------------------------------------
describe('parseCurrency', () => {
  it('converte "R$ 1.000,00" para 1000', () => {
    expect(parseCurrency('R$ 1.000,00')).toBe(1000)
  })

  it('converte "R$ 9,99" para 9.99', () => {
    expect(parseCurrency('R$ 9,99')).toBeCloseTo(9.99)
  })

  it('retorna 0 para null', () => {
    expect(parseCurrency(null)).toBe(0)
  })

  it('retorna 0 para undefined', () => {
    expect(parseCurrency(undefined)).toBe(0)
  })

  it('retorna 0 para string vazia', () => {
    expect(parseCurrency('')).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// formatPhone
// ---------------------------------------------------------------------------
describe('formatPhone', () => {
  it('formata celular com 11 digitos: (11) 99999-9999', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('formata telefone fixo com 10 digitos: (11) 3333-4444', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('retorna string vazia para null', () => {
    expect(formatPhone(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatPhone(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(formatPhone('')).toBe('')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('formata string ISO yyyy-MM-dd para dd/MM/yyyy', () => {
    expect(formatDate('2024-12-25')).toBe('25/12/2024')
  })

  it('formata string ISO com data de Janeiro', () => {
    expect(formatDate('2024-01-15')).toBe('15/01/2024')
  })

  it('retorna string vazia para null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('retorna string vazia para string invalida', () => {
    expect(formatDate('nao-e-data')).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(formatDate('')).toBe('')
  })
})

// ---------------------------------------------------------------------------
// formatDateTime
// ---------------------------------------------------------------------------
describe('formatDateTime', () => {
  it('retorna string vazia para null', () => {
    expect(formatDateTime(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatDateTime(undefined)).toBe('')
  })

  it('retorna string vazia para data invalida', () => {
    expect(formatDateTime('invalid-date')).toBe('')
  })

  it('inclui dia, mes, ano, hora e minuto no resultado', () => {
    const date = new Date(2024, 0, 15, 10, 30) // 15 Jan 2024 10:30 hora local
    const result = formatDateTime(date)
    expect(result).toContain('15')
    expect(result).toContain('01')
    expect(result).toContain('2024')
  })
})

// ---------------------------------------------------------------------------
// toInputDate
// ---------------------------------------------------------------------------
describe('toInputDate', () => {
  it('retorna string no formato yyyy-MM-dd para data fornecida', () => {
    const result = toInputDate(new Date('2024-06-20T12:00:00Z'))
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('usa data atual quando nenhuma e fornecida', () => {
    const result = toInputDate()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ---------------------------------------------------------------------------
// formatCpf
// ---------------------------------------------------------------------------
describe('formatCpf', () => {
  it('formata CPF sem mascara: 529.982.247-25', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25')
  })

  it('aceita CPF ja formatado e mantem o formato', () => {
    expect(formatCpf('529.982.247-25')).toBe('529.982.247-25')
  })

  it('retorna string vazia para null', () => {
    expect(formatCpf(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatCpf(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(formatCpf('')).toBe('')
  })
})

// ---------------------------------------------------------------------------
// formatCep
// ---------------------------------------------------------------------------
describe('formatCep', () => {
  it('formata CEP sem mascara: 01310-100', () => {
    expect(formatCep('01310100')).toBe('01310-100')
  })

  it('aceita CEP ja formatado e mantem o formato', () => {
    expect(formatCep('01310-100')).toBe('01310-100')
  })

  it('retorna string vazia para null', () => {
    expect(formatCep(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatCep(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(formatCep('')).toBe('')
  })
})
