import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Checkbox Component - Checkbox customizado com Tailwind
 */

export const Checkbox = React.forwardRef(
  (
    {
      checked,
      indeterminate,
      onChange,
      disabled = false,
      color = "primary",
      size = "medium",
      className,
      inputProps,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };

    const colorClasses = {
      primary: "text-blue-600 focus:ring-blue-500",
      secondary: "text-gray-600 focus:ring-gray-500",
      success: "text-green-600 focus:ring-green-500",
      error: "text-red-600 focus:ring-red-500",
      warning: "text-amber-600 focus:ring-amber-500",
      default: "text-blue-600 focus:ring-blue-500",
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "rounded border-gray-300 transition-colors cursor-pointer",
          "focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          colorClasses[color],
          indeterminate && "indeterminate:bg-blue-600 indeterminate:border-blue-600",
          className
        )}
        {...inputProps}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
