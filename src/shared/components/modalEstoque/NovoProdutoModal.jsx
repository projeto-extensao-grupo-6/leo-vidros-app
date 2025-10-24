import React, { useState } from 'react';
import { Package, X, ChevronDown } from 'lucide-react';

/**
 * Componente Modal para criação de um Novo Produto
 * @param {boolean} props.isOpen - Controla a visibilidade do modal
 * @param {function} props.onClose - Função para fechar o modal
 * @param {function} props.onSaveSuccess - Função para iniciar o pop-up de sucesso
 */
const NovoProdutoModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        unidade: 'Unidade',
        preco: '',
        descricao: ''
    });

    if (!isOpen) return null;

    // Ação principal: simula salvar e aciona o modal de sucesso
    const handleSave = () => {
        console.log("Salvando novo produto:", formData);
        onSaveSuccess();
    };

    // Previne que o modal feche se o usuário clicar dentro do conteúdo
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Overlay com escurecimento
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* Conteúdo do Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
                onClick={handleModalContentClick}
            >
                
                {/* Cabeçalho do Modal */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded">
                            <Package className="w-5 h-5 text-gray-700" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Novo produto</h2>
                    </div>
                </div>
                
                {/* Corpo do Formulário */}
                <div className="p-5 space-y-4">
                    
                    {/* Nome do produto */}
                    <div>
                        <label htmlFor="nomeProduto" className="block text-sm font-medium text-gray-900 mb-1.5">
                            Nome do produto
                        </label>
                        <input
                            type="text"
                            id="nomeProduto"
                            placeholder="Nome do produto"
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7] text-sm placeholder:text-gray-400"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        />
                    </div>

                    {/* Unidade de medida e Preço do produto */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Unidade de medida */}
                        <div>
                            <label htmlFor="unidadeMedida" className="block text-sm font-medium text-gray-900 mb-1.5">
                                Unidade de medida
                            </label>
                            <div className="relative">
                                <select 
                                    id="unidadeMedida"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7] text-sm bg-white"
                                    value={formData.unidade}
                                    onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                                >
                                    <option>Unidade</option>
                                    <option>Metro</option>
                                    <option>Kg</option>
                                    <option>Litro</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        
                        {/* Preço do produto */}
                        <div>
                            <label htmlFor="precoProduto" className="block text-sm font-medium text-gray-900 mb-1.5">
                                Preço do produto
                            </label>
                            <input
                                type="text"
                                id="precoProduto"
                                placeholder="R$ 00"
                                className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7] text-sm placeholder:text-gray-400"
                                value={formData.preco}
                                onChange={(e) => setFormData({...formData, preco: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Descrição do produto */}
                    <div>
                        <label htmlFor="descricaoProduto" className="block text-sm font-medium text-gray-900 mb-1.5">
                            Descrição do produto
                        </label>
                        <textarea
                            id="descricaoProduto"
                            rows="3"
                            placeholder="Adicione sua descrição"
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7] text-sm resize-none placeholder:text-gray-400"
                            value={formData.descricao}
                            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        />
                    </div>
                    
                    {/* Adicionar mais especificações */}
                    <button className="flex items-center gap-1.5 text-[#007EA7] hover:text-[#006891] font-medium text-sm transition-colors">
                        <span className="text-lg leading-none">+</span> Adicionar mais especificações
                    </button>

                </div>

                {/* Rodapé do Modal (Botões de Ação) */}
                <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#007EA7] text-white rounded-md hover:bg-[#006891] transition-colors font-medium text-sm"
                    >
                        Salvar Produto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NovoProdutoModal;