import React from "react";
import "./inputText.component.css";

/**
 * Componente de input de texto padronizado.
 * Suporta label, ícone, mensagem de erro, disabled e todas as props nativas do <input>.
 */
const InputText = React.forwardRef(function InputText(
  {
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    icon,
    error,
    disabled = false,
    required = false,
    className = "",
    ...props
  },
  ref
) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={[
            "w-full py-2 border rounded-lg shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            icon ? "pl-10 pr-3" : "px-3",
            error
              ? "border-red-400 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300",
            disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          className="mt-1 text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default InputText;