import React, { useState } from "react";
import { ChevronDown, Edit, MoreVertical } from "lucide-react";

/**
 * Componente de Linha da Tabela de Estoque
 * Inclui o gerenciamento de estado para expansão/colapso dos detalhes.
 */
const EstoqueItemRow = ({ item, isSelected, onToggle }) => {
    // Estado para controlar a expansão/colapso da linha
    const [isExpanded, setIsExpanded] = useState(false);

    const columnClasses = {
        checkbox: "w-[5%] pl-4 pr-1", 
        nome: "w-[15%] pl-2 pr-1",
        descricao: "w-[25%] px-4",
        preco: "w-[10%] text-center",
        quantidade: "w-[15%] text-center",
        situacao: "w-[15%] flex justify-center",
        acoes: "w-[15%] flex justify-end pr-4 gap-1",
    };

    const getSituacaoColor = (situacao) => {
        switch (situacao) {
            case "Disponível": return "bg-green-100 text-green-700";
            case "Abaixo do normal": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="mb-2">
            <div 
                // Adiciona uma borda inferior arredondada apenas se não estiver expandido
                className={`flex items-center border border-gray-200 bg-white hover:shadow-sm transition-shadow min-h-[64px] ${isExpanded ? 'rounded-t-md' : 'rounded-md'}`}
            >
                {/* Checkbox */}
                <div className={`py-4 text-sm whitespace-nowrap ${columnClasses.checkbox}`}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(item.nome)}
                        className="w-4 h-4 rounded border-gray-300 focus:ring-[#003d6b] text-[#003d6b]"
                    />
                </div>
                {/* Nome */}
                <div className={`py-4 text-sm text-gray-900 font-medium ${columnClasses.nome}`}>
                    {item.nome}
                </div>
                {/* Descrição */}
                <div className={`py-4 text-sm text-gray-600 ${columnClasses.descricao}`}>
                    {item.descricao}
                </div>
                {/* Preço */}
                <div className={`py-4 text-sm text-gray-900 ${columnClasses.preco}`}>
                    {item.preco}
                </div>
                {/* Quantidade */}
                <div className={`py-4 text-sm text-gray-900 font-medium ${columnClasses.quantidade}`}>
                    {item.quantidade}
                </div>
                {/* Situação */}
                <div className={`py-4 text-sm ${columnClasses.situacao}`}>
                    <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(item.situacao)}`}
                    >
                        {item.situacao}
                    </span>
                </div>
                {/* Ações */}
                <div className={`py-4 text-sm font-medium ${columnClasses.acoes}`}>
                    <button 
                        title="Editar"
                        className="text-gray-400 hover:text-[#007EA7] p-1 rounded transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    {/* Botão de Expansão que chama setIsExpanded */}
                    <button 
                        title="Expandir detalhes"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-400 hover:text-[#007EA7] p-1 rounded transition-colors"
                    >
                        <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Painel de Detalhes Expandido (renderizado condicionalmente) */}
            {isExpanded && item.detalhes && (
                <div className="border border-t-0 border-gray-200 rounded-b-md bg-gray-50 p-6 mt-0">
                    {/* Grid de Especificações */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 mb-6">
                        {item.detalhes.espessura && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Espessura</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.espessura}</p>
                            </div>
                        )}
                        {item.detalhes.unidadeMedida && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Uni. Medida</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.unidadeMedida}</p>
                            </div>
                        )}
                        {item.detalhes.tipoVidro && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Tipo de vidro</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.tipoVidro}</p>
                            </div>
                        )}
                        {item.detalhes.cor && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Cor</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.cor}</p>
                            </div>
                        )}
                        {item.detalhes.aplicacao && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Aplicação típica</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.aplicacao}</p>
                            </div>
                        )}
                        {item.detalhes.acabamento && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Acabamento das bordas</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.acabamento}</p>
                            </div>
                        )}
                        {item.detalhes.valorCompra && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Valor compra</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.valorCompra}</p>
                            </div>
                        )}
                        {item.detalhes.valorVenda && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Valor Venda</p>
                                <p className="text-sm font-medium text-gray-900">{item.detalhes.valorVenda}</p>
                            </div>
                        )}
                    </div>

                    {/* Seção de Movimentos */}
                    {item.detalhes.movimentos && item.detalhes.movimentos.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Movimentos</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {/* Cabeçalho da tabela de movimentos */}
                                <div className="grid grid-cols-6 gap-4 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                    <div>Tipo de Movimento</div>
                                    <div>Data</div>
                                    <div>Unidade de medida</div>
                                    <div>Quantidade</div>
                                    <div>Observação</div>
                                    <div>Funcionário resposável</div>
                                </div>
                                {/* Linhas de movimentos */}
                                {item.detalhes.movimentos.map((movimento, idx) => (
                                    <div key={idx} className="grid grid-cols-6 gap-4 px-4 py-3 text-sm border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                movimento.tipo === 'Saída' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {movimento.tipo}
                                            </span>
                                        </div>
                                        <div className="text-gray-900">{movimento.data}</div>
                                        <div className="text-gray-900">{movimento.unidade}</div>
                                        <div className="text-gray-900">{movimento.quantidade}</div>
                                        <div className="text-gray-600 text-xs overflow-hidden max-h-10">
                                            {movimento.observacao}
                                        </div>
                                        <div className="text-gray-900">{movimento.funcionario}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EstoqueItemRow;