export default function FormField({
  id,
  label,
  required = false,
  error,
  registration,
  children,
  hint,
  className = "",
  inputClassName = "",
  type = "text",
  placeholder,
  disabled = false,
  ...inputProps
}) {
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="flex items-center text-sm font-medium text-gray-700 gap-0.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Se children for passado, renderiza-o (ex: IMaskInput via Controller) */}
      {children ?? (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          className={[
            "w-full px-4 py-2 border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7]",
            errorMessage
              ? "border-red-400 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300",
            disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          {...registration}
          {...inputProps}
        />
      )}

      {hint && !errorMessage && <p className="text-xs text-gray-400">{hint}</p>}

      {errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
