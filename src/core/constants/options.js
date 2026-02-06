/**
 * Opções de formulários e dropdowns
 */

// Tipos de Contrato
export const CONTRATO_TIPOS = {
  REGISTRADO: 'Registrado',
  FIXO: 'Fixo',
  TEMPORARIO: 'Temporário',
};

export const CONTRATO_TIPOS_OPTIONS = [
  { value: CONTRATO_TIPOS.REGISTRADO, label: 'Registrado' },
  { value: CONTRATO_TIPOS.FIXO, label: 'Fixo' },
  { value: CONTRATO_TIPOS.TEMPORARIO, label: 'Temporário' },
];

// Turnos de Trabalho
export const TURNOS = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
  INTEGRAL: 'Integral',
};

export const TURNOS_OPTIONS = [
  { value: TURNOS.MANHA, label: 'Manhã' },
  { value: TURNOS.TARDE, label: 'Tarde' },
  { value: TURNOS.NOITE, label: 'Noite' },
  { value: TURNOS.INTEGRAL, label: 'Integral' },
];

// Formas de Pagamento
export const FORMAS_PAGAMENTO = {
  DINHEIRO: 'Dinheiro',
  PIX: 'Pix',
  DEBITO: 'Débito',
  CREDITO: 'Crédito',
  CREDITO_PARCELADO: 'Crédito Parcelado',
  BOLETO: 'Boleto',
  TRANSFERENCIA: 'Transferência',
  NA: 'N/A',
};

export const FORMAS_PAGAMENTO_OPTIONS = [
  { value: FORMAS_PAGAMENTO.DINHEIRO, label: 'Dinheiro' },
  { value: FORMAS_PAGAMENTO.PIX, label: 'Pix' },
  { value: FORMAS_PAGAMENTO.DEBITO, label: 'Débito' },
  { value: FORMAS_PAGAMENTO.CREDITO, label: 'Crédito' },
  { value: FORMAS_PAGAMENTO.CREDITO_PARCELADO, label: 'Crédito Parcelado' },
  { value: FORMAS_PAGAMENTO.BOLETO, label: 'Boleto' },
  { value: FORMAS_PAGAMENTO.TRANSFERENCIA, label: 'Transferência' },
  { value: FORMAS_PAGAMENTO.NA, label: 'N/A' },
];

// Estados Brasileiros
export const ESTADOS_BR = {
  AC: 'AC', AL: 'AL', AP: 'AP', AM: 'AM', BA: 'BA', CE: 'CE', DF: 'DF', ES: 'ES',
  GO: 'GO', MA: 'MA', MT: 'MT', MS: 'MS', MG: 'MG', PA: 'PA', PB: 'PB', PR: 'PR',
  PE: 'PE', PI: 'PI', RJ: 'RJ', RN: 'RN', RS: 'RS', RO: 'RO', RR: 'RR', SC: 'SC',
  SP: 'SP', SE: 'SE', TO: 'TO',
};

export const ESTADOS_BR_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Categorias de Produtos
export const CATEGORIAS_PRODUTO = {
  VIDROS: 'Vidros',
  FERRAMENTAS: 'Ferramentas',
  ACESSORIOS: 'Acessórios',
  ESQUADRIAS: 'Esquadrias',
  MATERIAIS: 'Materiais',
  OUTROS: 'Outros',
};

export const CATEGORIAS_PRODUTO_OPTIONS = [
  { value: CATEGORIAS_PRODUTO.VIDROS, label: 'Vidros' },
  { value: CATEGORIAS_PRODUTO.FERRAMENTAS, label: 'Ferramentas' },
  { value: CATEGORIAS_PRODUTO.ACESSORIOS, label: 'Acessórios' },
  { value: CATEGORIAS_PRODUTO.ESQUADRIAS, label: 'Esquadrias' },
  { value: CATEGORIAS_PRODUTO.MATERIAIS, label: 'Materiais' },
  { value: CATEGORIAS_PRODUTO.OUTROS, label: 'Outros' },
];

// Unidades de Medida
export const UNIDADES_MEDIDA = {
  UN: 'Unidade',
  M2: 'm²',
  ML: 'ml',
  KG: 'kg',
  PC: 'Peça',
  CX: 'Caixa',
  LT: 'Litro',
};

export const UNIDADES_MEDIDA_OPTIONS = [
  { value: UNIDADES_MEDIDA.UN, label: 'Unidade' },
  { value: UNIDADES_MEDIDA.M2, label: 'm²' },
  { value: UNIDADES_MEDIDA.ML, label: 'ml' },
  { value: UNIDADES_MEDIDA.KG, label: 'kg' },
  { value: UNIDADES_MEDIDA.PC, label: 'Peça' },
  { value: UNIDADES_MEDIDA.CX, label: 'Caixa' },
  { value: UNIDADES_MEDIDA.LT, label: 'Litro' },
];
