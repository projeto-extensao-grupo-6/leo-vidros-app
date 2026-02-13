import React from 'react';

export const ErrorState = ({ error, onRetry, entityName = "registros" }) => (
    <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p className="font-medium">Erro ao carregar {entityName}</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
            Tentar Novamente
        </button>
    </div>
);

export const EmptyState = ({ 
    hasFilters, 
    totalItems, 
    entityName = "registro",
    entityNamePlural = "registros"
}) => {
    const getMessage = () => {
        if (totalItems === 0) {
            return `Nenhum ${entityName} cadastrado ainda.`;
        }
        if (hasFilters) {
            return `Nenhum ${entityName} encontrado com os filtros atuais.`;
        }
        return `Nenhum ${entityName} disponível.`;
    };

    return (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            {getMessage()}
        </div>
    );
};
