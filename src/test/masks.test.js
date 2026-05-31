import { describe, it, expect } from 'vitest'
import {
  cpfMask,
  phoneMask,
  cepMask,
  onlyLetters,
  isValidCPF,
  removeMask,
} from '../utils/masks.js'

// ---------------------------------------------------------------------------
// cpfMask
// ---------------------------------------------------------------------------
describe('cpfMask', () => {
  it('aplica máscara em CPF sem formatação: 123.456.789-01', () => {
    expect(cpfMask('12345678901')).toBe('123.456.789-01')
  })

  it('aceita CPF já formatado e mantém a máscara', () => {
    expect(cpfMask('123.456.789-01')).toBe('123.456.789-01')
  })

  it('retorna string vazia para null', () => {
    expect(cpfMask(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(cpfMask(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(cpfMask('')).toBe('')
  })

  it('aplica máscara parcial em string curta', () => {
    const result = cpfMask('123')
    expect(result).toBe('123')
  })

  it('não extrapola além de 11 dígitos (trunca extras)', () => {
    const result = cpfMask('1234567890123')
    // A máscara deve resultar em no máximo o formato 123.456.789-01
    expect(result).toBe('123.456.789-01')
  })
})

// ---------------------------------------------------------------------------
// phoneMask
// ---------------------------------------------------------------------------
describe('phoneMask', () => {
  it('formata celular com 11 dígitos: (11) 99999-9999', () => {
    expect(phoneMask('11999999999')).toBe('(11) 99999-9999')
  })

  it('formata telefone fixo com 10 dígitos: (11) 3333-4444', () => {
    expect(phoneMask('1133334444')).toBe('(11) 3333-4444')
  })

  it('aceita string já com máscara', () => {
    expect(phoneMask('(11) 99999-9999')).toBe('(11) 99999-9999')
  })

  it('retorna string vazia para null', () => {
    expect(phoneMask(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(phoneMask(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(phoneMask('')).toBe('')
  })

  it('aplica máscara parcial em string curta sem quebrar', () => {
    const result = phoneMask('11')
    expect(typeof result).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// cepMask
// ---------------------------------------------------------------------------
describe('cepMask', () => {
  it('formata CEP com 8 dígitos: 01310-100', () => {
    expect(cepMask('01310100')).toBe('01310-100')
  })

  it('aceita CEP já formatado e mantém o formato', () => {
    expect(cepMask('01310-100')).toBe('01310-100')
  })

  it('retorna string vazia para null', () => {
    expect(cepMask(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(cepMask(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(cepMask('')).toBe('')
  })

  it('aplica máscara parcial em string curta sem quebrar', () => {
    const result = cepMask('01310')
    expect(result).toBe('01310')
  })
})

// ---------------------------------------------------------------------------
// onlyLetters
// ---------------------------------------------------------------------------
describe('onlyLetters', () => {
  it('remove números e caracteres especiais mantendo letras e espaços', () => {
    expect(onlyLetters('João 123!')).toBe('João ')
  })

  it('mantém acentos e caracteres especiais do português', () => {
    expect(onlyLetters('São Paulo')).toBe('São Paulo')
  })

  it('retorna string vazia para null', () => {
    expect(onlyLetters(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(onlyLetters(undefined)).toBe('')
  })
})

// ---------------------------------------------------------------------------
// isValidCPF
// ---------------------------------------------------------------------------
describe('isValidCPF', () => {
  it('retorna true para CPF válido (529.982.247-25)', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true)
  })

  it('retorna true para CPF válido sem máscara (52998224725)', () => {
    expect(isValidCPF('52998224725')).toBe(true)
  })

  it('retorna false para CPF com todos os dígitos iguais (111.111.111-11)', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false)
  })

  it('retorna false para CPF com todos os dígitos iguais (000.000.000-00)', () => {
    expect(isValidCPF('000.000.000-00')).toBe(false)
  })

  it('retorna false para CPF com dígitos verificadores errados (123.456.789-00)', () => {
    expect(isValidCPF('123.456.789-00')).toBe(false)
  })

  it('retorna false para CPF muito curto', () => {
    expect(isValidCPF('12345')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// removeMask
// ---------------------------------------------------------------------------
describe('removeMask', () => {
  it('remove pontos, traços e parênteses de CPF', () => {
    expect(removeMask('529.982.247-25')).toBe('52998224725')
  })

  it('remove formatação de telefone', () => {
    expect(removeMask('(11) 99999-9999')).toBe('11999999999')
  })

  it('remove formatação de CEP', () => {
    expect(removeMask('01310-100')).toBe('01310100')
  })

  it('retorna string vazia para null', () => {
    expect(removeMask(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(removeMask(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(removeMask('')).toBe('')
  })
})
