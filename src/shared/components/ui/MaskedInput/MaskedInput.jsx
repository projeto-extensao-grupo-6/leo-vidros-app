import React, { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import Input from "../Input";

/**
 * Componente de Input com máscara usando IMask
 * Integrado com react-hook-form através de forwardRef
 * 
 * @param {string} mask - Padrão da máscara (ex: "(00) 00000-0000")
 * @param {string} label - Label do input
 * @param {string} error - Mensagem de erro
 * @param {object} inputProps - Props adicionais para o Input
 * @param {function} onAccept - Callback quando o valor é aceito pela máscara
 */
const MaskedInput = forwardRef(({ 
  mask, 
  label, 
  error, 
  onAccept,
  onChange,
  value,
  ...inputProps 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <IMaskInput
        mask={mask}
        value={value}
        unmask={false} // Mantém a máscara no valor
        onAccept={(value, maskRef) => {
          // Chama o callback personalizado se existir
          if (onAccept) {
            onAccept(value, maskRef);
          }
          // Chama o onChange do react-hook-form
          if (onChange) {
            onChange({ target: { value } });
          }
        }}
        {...inputProps}
        className={`
          w-full px-4 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${inputProps.className || ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;
