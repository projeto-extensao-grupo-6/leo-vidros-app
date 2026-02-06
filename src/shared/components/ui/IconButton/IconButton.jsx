import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * IconButton Component - Botão de ícone customizado com Tailwind
 */

export const IconButton = ({
  children,
  size = "medium",
  color = "default",
  disabled = false,
  className,
  edge,
  ...props
}) => {
  const sizeClasses = {
    small: "w-8 h-8 p-1",
    medium: "w-10 h-10 p-2",
    large: "w-12 h-12 p-3",
  };

  const colorClasses = {
    default: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    primary: "text-blue-600 hover:bg-blue-50 active:bg-blue-100",
    secondary: "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
    success: "text-green-600 hover:bg-green-50 active:bg-green-100",
    error: "text-red-600 hover:bg-red-50 active:bg-red-100",
    warning: "text-amber-600 hover:bg-amber-50 active:bg-amber-100",
    info: "text-blue-600 hover:bg-blue-50 active:bg-blue-100",
    inherit: "text-inherit hover:bg-white/10 active:bg-white/20",
  };

  const edgeClasses = {
    start: "-ml-2",
    end: "-mr-2",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        sizeClasses[size],
        colorClasses[color],
        edge && edgeClasses[edge],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
