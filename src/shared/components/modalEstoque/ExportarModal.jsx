import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

/**
 * Modal para Exportar Planilha
 * @param {boolean} props.isOpen - Controla a visibilidade do modal
 * @param {function} props.onClose - Função para fechar o modal
 */
const ExportarModal = ({ isOpen, onClose }) => {
    const [arquivoSelecionado, setArquivoSelecionado] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const handleExportar = () => {
        console.log("Exportando planilha...");
        // Aqui você implementaria a lógica de exportação
        onClose();
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Aqui você lidaria com os arquivos soltos
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setArquivoSelecionado(files[0].name);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setArquivoSelecionado(files[0].name);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto"
                onClick={handleModalContentClick}
            >
                
                {/* Cabeçalho */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded">
                            <Download className="w-5 h-5 text-gray-700" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Exportar planilha</h2>
                    </div>
                </div>
                
                {/* Corpo do Modal */}
                <div className="p-5 space-y-4">
                    
                    {/* Escolher Arquivo - Dropdown */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <input 
                                type="checkbox" 
                                id="escolherArquivo"
                                className="w-4 h-4 rounded border-gray-300 text-[#007EA7] focus:ring-[#007EA7]"
                                defaultChecked
                            />
                            <label htmlFor="escolherArquivo" className="text-sm font-medium text-gray-900">
                                Escolher Arquivo
                            </label>
                        </div>
                    </div>

                    {/* Seção Arquivos */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <input 
                                type="checkbox" 
                                id="arquivos"
                                className="w-4 h-4 rounded border-gray-300 text-[#007EA7] focus:ring-[#007EA7]"
                            />
                            <label htmlFor="arquivos" className="text-sm font-medium text-gray-900">
                                Arquivos
                            </label>
                        </div>

                        {/* Área de Drag and Drop */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                isDragging 
                                    ? 'border-[#007EA7] bg-blue-50' 
                                    : 'border-gray-300 bg-white'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {/* Ícone de Download */}
                            <div className="flex justify-center mb-3">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <Download className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>

                            {/* Texto */}
                            <p className="text-sm text-gray-500 mb-1">
                                Você pode arrastar e soltar arquivos aqui para adicioná-los
                            </p>

                            {/* Input file oculto */}
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept=".xlsx,.xls,.csv"
                            />
                            
                            {arquivoSelecionado && (
                                <p className="text-sm text-[#007EA7] font-medium mt-2">
                                    Arquivo selecionado: {arquivoSelecionado}
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Rodapé com Botões */}
                <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleExportar}
                        className="px-4 py-2 bg-[#007EA7] text-white rounded-md hover:bg-[#006891] transition-colors font-medium text-sm"
                    >
                        Exportar Planilha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportarModal;