import React, { memo } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

/**
 * Componente de linha de item do estoque
 * 
 * Props esperadas:
 * - item: {
 *     id: number,
 *     situacao: string,
 *     produto: {
 *       id: number,
 *       nome: string,
 *       descricao: string,
 *       preco: string (já formatado),
 *       quantidade: number
 *     }
 *   }
 * - isSelected: boolean
 * - onToggle: function
 * - onEdit: function
 * - onDelete: function
 * - onViewDetails: function
 */
const EstoqueItemRow = ({
  item,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // Classe de estilo baseada na situação
  const situacaoClasse =
    item.situacao === "Fora de estoque"
      ? "text-red-600 font-semibold"
      : item.situacao === "Abaixo do normal"
      ? "text-yellow-600 font-semibold"
      : "text-green-600 font-semibold";

  // Dados do produto com fallbacks seguros
  const produto = item.produto || {};
  const produtoId = produto.id;
  const nome = produto.nome || "Sem nome";
  const descricao = produto.descricao || "—";
  const preco = produto.preco || "R$ 0,00";
  const quantidade = produto.quantidade ?? 0;

  // Log para debug (remover em produção)
  if (!produtoId) {
    console.error("⚠️ EstoqueItemRow: produto.id está undefined!", item);
  }

  return (
    <div
      className="flex items-center border-b border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
      id={`item-${produto.id || item.id}`}
    >
      {/* Checkbox */}
      <div className="py-3 w-[5%] pl-4 pr-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 text-[#003d6b] border-gray-300 rounded focus:ring-[#003d6b] cursor-pointer"
          aria-label={`Selecionar ${nome}`}
        />
      </div>

      {/* Nome */}
      <div 
        className="py-3 w-[15%] pl-2 pr-1 truncate font-medium text-gray-800"
        title={nome}
      >
        {nome}
      </div>

      {/* Descrição */}
      <div 
        className="py-3 w-[25%] px-4 text-gray-600 truncate"
        title={descricao !== "—" ? descricao : ""}
      >
        {descricao}
      </div>

      {/* Preço */}
      <div className="py-3 w-[10%] text-center text-gray-700 font-medium">
        {preco}
      </div>

      {/* Quantidade */}
      <div className="py-3 w-[15%] text-center font-semibold text-gray-800">
        {quantidade}
      </div>

      {/* Situação */}
      <div className={`py-3 w-[15%] text-center ${situacaoClasse}`}>
        {item.situacao}
      </div>

      {/* Ações */}
      <div className="py-3 w-[15%] text-right pr-4 flex justify-end gap-2">
        {/* Ver */}
        <button
          onClick={onViewDetails}
          className="p-2 rounded-md hover:bg-blue-50 text-[#007EA7] transition-colors duration-150"
          title="Ver detalhes"
          aria-label={`Ver detalhes de ${nome}`}
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Deletar */}
        <button
          onClick={onDelete}
          className="p-2 rounded-md hover:bg-red-50 text-red-600 transition-colors duration-150"
          title="Excluir item"
          aria-label={`Excluir ${nome}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Memoização para evitar re-renders desnecessários
// Só re-renderiza se as props mudarem
export default memo(EstoqueItemRow, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.situacao === nextProps.item.situacao &&
    prevProps.item.produto.nome === nextProps.item.produto.nome &&
    prevProps.item.produto.descricao === nextProps.item.produto.descricao &&
    prevProps.item.produto.preco === nextProps.item.produto.preco &&
    prevProps.item.produto.quantidade === nextProps.item.produto.quantidade &&
    prevProps.isSelected === nextProps.isSelected
  );
});