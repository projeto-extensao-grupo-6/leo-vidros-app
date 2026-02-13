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
  icon,
  ...inputProps 
}, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-start py-3 text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <IMaskInput
          mask={mask}
          value={value}
          unmask={false}
          onAccept={(value, maskRef) => {
            if (onAccept) {
              onAccept(value, maskRef);
            }
            if (onChange) {
              onChange({ target: { value } });
            }
          }}
          {...inputProps}
          className={`
            w-full h-10 px-3 py-2 border rounded-md transition-all duration-200
            border-gray-300 bg-white placeholder:text-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${inputProps.className || ''}
          `}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;
