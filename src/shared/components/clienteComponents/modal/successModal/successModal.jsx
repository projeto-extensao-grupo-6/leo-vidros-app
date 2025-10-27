import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function SuccessModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    // OVERLAY: Centralizado, com padding, fundo preto/50% e filtro grayscale
    <div 
      className="fixed inset-0 bg-black/50 backdrop-grayscale flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div 
        // MODAL: Ajustes de tamanho e estrutura para centralizar o conteúdo verticalmente
        className="w-[450px] max-w-full h-auto bg-white rounded-lg border 
        border-gray-200 shadow-2xl p-6 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 text-start justify-center p-2 mb-4">
          <FontAwesomeIcon 
            icon={faCircleCheck} 
            className="text-green-500 text-5xl"
          />
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
                Ação realizada com sucesso!
            </h2>
            <p className="text-sm text-gray-600">
              {message || "O cliente foi cadastrado com sucesso."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button 
            type="button" 
            className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold
            text-sm hover:bg-blue-600 transition-colors"
            onClick={onConfirm}
          >
            Aceitar
          </button>
          <button 
            type="button" 
            className="px-6 py-2 bg-gray-100 text-gray-800 border
            border-gray-300 rounded-md font-semibold text-sm hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;