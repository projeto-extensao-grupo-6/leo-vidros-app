import React from "react";
import { useState } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "../../../utils/cn";
import Button from "../Button/Button.component";
import Input from "./Input";

const MultipleSelectCheckmarks = React.forwardRef(
  (
    {
      className,
      options = [],
      value = [],
      placeholder = "Selecione opções",
      disabled = false,
      required = false,
      label,
      description,
      error,
      searchable = false,
      clearable = false,
      loading = false,
      id,
      name,
      onChange,
      onOpenChange,
      showSelectAll = true,
      maxDisplayItems = 2,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const selectId =
      id || `select-${Math.random()?.toString(36)?.substr(2, 9)}`;

    const filteredOptions =
      searchable && searchTerm
        ? options?.filter(
            (option) =>
              option?.label
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase()) ||
              (option?.value &&
                option?.value
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(searchTerm?.toLowerCase())),
          )
        : options;

    const getSelectedDisplay = () => {
      const selectedOptions = options?.filter((opt) =>
        value?.includes(opt?.value),
      );

      if (selectedOptions?.length === 0) return placeholder;

      if (selectedOptions?.length <= maxDisplayItems) {
        return selectedOptions?.map((opt) => opt?.label)?.join(", ");
      }

      return `${selectedOptions?.length} itens selecionados`;
    };

    const handleToggle = () => {
      if (!disabled) {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
        if (!newIsOpen) {
          setSearchTerm("");
        }
      }
    };

    const handleOptionToggle = (option) => {
      const newValue = value || [];
      const updatedValue = newValue?.includes(option?.value)
        ? newValue?.filter((v) => v !== option?.value)
        : [...newValue, option?.value];
      onChange?.(updatedValue);
    };

    const handleSelectAll = () => {
      const availableOptions = filteredOptions?.filter((opt) => !opt?.disabled);
      const allValues = availableOptions?.map((opt) => opt?.value);
      const currentFilteredSelected = value?.filter((v) =>
        availableOptions?.some((opt) => opt?.value === v),
      );

      if (currentFilteredSelected?.length === availableOptions?.length) {
        const updatedValue = value?.filter((v) => !allValues?.includes(v));
        onChange?.(updatedValue);
      } else {
        const updatedValue = [...new Set([...value, ...allValues])];
        onChange?.(updatedValue);
      }
    };

    const handleClear = (e) => {
      e?.stopPropagation();
      onChange?.([]);
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e?.target?.value);
    };

    const isSelected = (optionValue) => {
      return value?.includes(optionValue) || false;
    };

    const isAllSelected = () => {
      const availableOptions = filteredOptions?.filter((opt) => !opt?.disabled);
      return (
        availableOptions?.length > 0 &&
        availableOptions?.every((opt) => value?.includes(opt?.value))
      );
    };

    const hasValue = value?.length > 0;

    return (
      <div className={cn("relative", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "mb-2 block text-sm leading-none font-medium",
              error ? "text-destructive" : "text-foreground",
              disabled && "cursor-not-allowed opacity-70",
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            id={selectId}
            type="button"
            className={cn(
              "border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive",
              !hasValue && "text-muted-foreground",
            )}
            onClick={handleToggle}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            {...props}
          >
            <span className="truncate">{getSelectedDisplay()}</span>

            <div className="ml-2 flex items-center gap-1">
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}

              {clearable && hasValue && !loading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </button>

          {/* Hidden native select for form submission */}
          <select
            name={name}
            value={value}
            onChange={() => {}}
            className="sr-only"
            tabIndex={-1}
            multiple
            required={required}
          >
            <option value="">Select...</option>
            {options?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Dropdown */}
          {isOpen && (
            <div className="border-border absolute z-50 mt-1 w-full rounded-md border bg-white text-black shadow-md">
              {searchable && (
                <div className="border-b p-2">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                      placeholder="Buscar opções..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-8"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <div className="max-h-60 overflow-auto py-1">
                {showSelectAll && filteredOptions?.length > 0 && (
                  <div
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 border-b px-3 py-2 text-sm font-medium select-none",
                    )}
                    onClick={handleSelectAll}
                  >
                    <div
                      className={cn(
                        "border-primary flex h-4 w-4 items-center justify-center rounded border",
                        isAllSelected() && "bg-primary text-primary-foreground",
                      )}
                    >
                      {isAllSelected() && <Check className="h-3 w-3" />}
                    </div>
                    <span>Selecionar todos</span>
                  </div>
                )}

                {filteredOptions?.length === 0 ? (
                  <div className="text-muted-foreground px-3 py-2 text-sm">
                    {searchTerm
                      ? "Nenhuma opção encontrada"
                      : "Nenhuma opção disponível"}
                  </div>
                ) : (
                  filteredOptions?.map((option) => (
                    <div
                      key={option?.value}
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none select-none",
                        option?.disabled && "pointer-events-none opacity-50",
                      )}
                      onClick={() =>
                        !option?.disabled && handleOptionToggle(option)
                      }
                    >
                      <div
                        className={cn(
                          "border-primary flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          isSelected(option?.value) &&
                            "bg-primary text-primary-foreground",
                        )}
                      >
                        {isSelected(option?.value) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span>{option?.label}</span>
                        {option?.description && (
                          <span className="text-muted-foreground text-xs">
                            {option?.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
      </div>
    );
  },
);

MultipleSelectCheckmarks.displayName = "MultipleSelectCheckmarks";

export default MultipleSelectCheckmarks;
