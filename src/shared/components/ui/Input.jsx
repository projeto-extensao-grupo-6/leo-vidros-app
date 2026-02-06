import React from "react";
import { cn } from "../../../utils/cn";

/**
 * Input Component - Componente de input profissional e otimizado
 * 
 * @param {string} label - Label do input
 * @param {string} type - Tipo do input (text, email, password, number, tel, search, url, date, time, datetime-local, checkbox, radio, select, textarea)
 * @param {string} placeholder - Placeholder do input
 * @param {string} error - Mensagem de erro
 * @param {string} description - Descrição auxiliar
 * @param {boolean} required - Se o campo é obrigatório
 * @param {boolean} disabled - Se o campo está desabilitado
 * @param {string} size - Tamanho (sm, md, lg)
 * @param {ReactNode} startIcon - Ícone no início do input
 * @param {ReactNode} endIcon - Ícone no final do input
 * @param {string} variant - Variante (outlined, filled, standard)
 * @param {boolean} fullWidth - Se ocupa toda a largura
 * @param {Array} options - Opções para select
 * @param {number} rows - Número de linhas para textarea
 */
const Input = React.forwardRef(({
    className,
    containerClassName,
    type = "text",
    label,
    description,
    error,
    required = false,
    disabled = false,
    id,
    size = "md",
    startIcon,
    endIcon,
    icon,
    variant = "outlined",
    fullWidth = true,
    options = [],
    rows = 3,
    select = false,
    children,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-8 text-xs px-2 py-1",
        md: "h-10 text-sm px-3 py-2",
        lg: "h-12 text-base px-4 py-3"
    };

    // Variant styles
    const variantClasses = {
        outlined: "border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        filled: "border-0 bg-gray-100 focus:bg-gray-200 focus:ring-2 focus:ring-blue-500/20",
        standard: "border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 px-0"
    };

    // Base input classes
    const baseInputClasses = cn(
        "w-full rounded-md transition-all duration-200",
        "placeholder:text-gray-400",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        sizeClasses[size],
        variantClasses[variant],
        (startIcon || icon) && "pl-10",
        endIcon && "pr-10",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    );

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <label className={cn("inline-flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50", containerClassName)}>
                <input
                    type="checkbox"
                    className={cn(
                        "h-4 w-4 rounded border-gray-300 text-blue-600",
                        "focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors duration-200",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    {...props}
                />
                {label && (
                    <span className="ml-2 text-sm text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                )}
            </label>
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <label className={cn("inline-flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50", containerClassName)}>
                <input
                    type="radio"
                    className={cn(
                        "h-4 w-4 rounded-full border-gray-300 text-blue-600",
                        "focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors duration-200",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    {...props}
                />
                {label && (
                    <span className="ml-2 text-sm text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                )}
            </label>
        );
    }

    // Select dropdown
    if (select || type === "select") {
        return (
            <div className={cn("space-y-1", fullWidth ? "w-full" : "w-auto", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "block text-sm font-medium",
                            error ? "text-red-600" : "text-gray-700",
                            disabled && "opacity-50"
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {(startIcon || icon) && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {startIcon || icon}
                        </div>
                    )}

                    <select
                        className={cn(
                            baseInputClasses,
                            "pr-8 appearance-none bg-no-repeat bg-right",
                            "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')]",
                            className
                        )}
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        {...props}
                    >
                        {children || options.map((option, index) => (
                            <option key={index} value={option.value || option}>
                                {option.label || option}
                            </option>
                        ))}
                    </select>

                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {endIcon}
                        </div>
                    )}
                </div>

                {description && !error && (
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}

                {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        );
    }

    // Textarea
    if (type === "textarea") {
        return (
            <div className={cn("space-y-1", fullWidth ? "w-full" : "w-auto", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "block text-sm font-medium",
                            error ? "text-red-600" : "text-gray-700",
                            disabled && "opacity-50"
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    className={cn(
                        baseInputClasses,
                        "min-h-[80px] resize-vertical",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    rows={rows}
                    disabled={disabled}
                    {...props}
                />

                {description && !error && (
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}

                {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        );
    }

    // Regular inputs with wrapper structure
    return (
        <div className={cn("space-y-1", fullWidth ? "w-full" : "w-auto", containerClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "block text-sm font-medium",
                        error ? "text-red-600" : "text-gray-700",
                        disabled && "opacity-50"
                    )}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {(startIcon || icon) && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {startIcon || icon}
                    </div>
                )}

                <input
                    type={type}
                    className={cn(baseInputClasses, className)}
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    {...props}
                />

                {endIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {endIcon}
                    </div>
                )}
            </div>

            {description && !error && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}

            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;