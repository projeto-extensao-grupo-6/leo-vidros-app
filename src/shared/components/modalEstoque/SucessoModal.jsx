import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Modal de Confirmação de Sucesso (Produto Adicionado)
 * @param {object} props
 * @param {boolean} props.isOpen - Controla a visibilidade.
 * @param {function} props.onClose - Função para fechar o modal.
 */
const SucessoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Previne que o modal feche se o usuário clicar dentro do conteúdo
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Overlay transparente, mas garantindo que o modal esteja acima de tudo (z-index mais alto)
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* Conteúdo do Pop-up (pequeno, como no print) */}
            <div 
                className="bg-white rounded-lg shadow-2xl p-4 w-full max-w-110 mx-auto text-center"
                onClick={handleModalContentClick}
            >
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Produto foi adicionado com sucesso
                </h3>
                
                <p className="text-sm text-gray-500">
                    O produto foi adicionado no sistema
                </p>
            </div>
        </div>
    );
};

export default SucessoModal;