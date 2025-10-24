import React from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';

/**
 * Componente Dropdown de Filtros
 * Permite selecionar múltiplas opções de filtro.
 * * @param {boolean} isOpen - Se o dropdown está aberto.
 * @param {function} onClose - Função para fechar o dropdown.
 * @param {object} selectedFilters - Objeto contendo os filtros selecionados (ex: {situacao: ['Disponível']}).
 * @param {function} onFilterChange - Função callback para atualizar o estado do filtro no componente pai.
 */
const FilterDropdown = ({ isOpen, onClose, selectedFilters, onFilterChange }) => {
    // Definição das opções de filtro (pode vir de uma API no futuro)
    const filterOptions = {
        situacao: {
            title: "Situação do Estoque",
            options: ["Disponível", "Abaixo do normal", "Fora de estoque"]
        },
        tipo: {
            title: "Tipo de Produto",
            options: ["Vidros", "Ferragens", "Acessórios", "Ferramentas", "EPIS"]
        },
        // Poderiam haver mais filtros aqui, como "Preço (faixa)", "Unidade de Medida", etc.
    };

    // Função para lidar com a seleção/desseleção de uma opção
    const handleToggleFilter = (filterKey, option) => {
        const currentSelection = selectedFilters[filterKey] || [];
        const newSelection = currentSelection.includes(option)
            ? currentSelection.filter(item => item !== option) // Remove
            : [...currentSelection, option]; // Adiciona
        
        onFilterChange({
            ...selectedFilters,
            [filterKey]: newSelection
        });
    };

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    return (
        <div 
            className="absolute z-10 top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
            // Poderia usar um Hook para fechar o menu ao clicar fora
        >
            <div className="flex items-center text-sm font-bold text-gray-700 mb-4 border-b pb-3">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
            </div>

            {Object.keys(filterOptions).map(key => (
                <div key={key} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{filterOptions[key].title}</h3>
                    <div className="space-y-1">
                        {filterOptions[key].options.map(option => {
                            const isSelected = (selectedFilters[key] || []).includes(option);
                            return (
                                <div
                                    key={option}
                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => handleToggleFilter(key, option)}
                                >
                                    <span className={`text-sm ${isSelected ? 'font-medium text-[#003d6b]' : 'text-gray-700'}`}>
                                        {option}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-[#003d6b]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Rodapé com botões de Ação */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <button
                    onClick={() => onFilterChange({})} // Limpar todos os filtros
                    className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                    Limpar Filtros
                </button>
                <button
                    onClick={onClose}
                    className="bg-[#007EA7] text-white text-sm font-medium py-1.5 px-4 rounded-md hover:bg-[#006891] transition-colors"
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
};

export default FilterDropdown;