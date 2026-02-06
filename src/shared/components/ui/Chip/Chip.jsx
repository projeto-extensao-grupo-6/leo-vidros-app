import React from "react";
import { cn } from "../../../../utils/cn";
import { X } from "lucide-react";

/**
 * Chip Component - Badge/Tag customizado com Tailwind
 */

export const Chip = ({
  label,
  color = "default",
  variant = "filled",
  size = "medium",
  onDelete,
  deleteIcon,
  icon,
  className,
  ...props
}) => {
  const colorClasses = {
    filled: {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      primary: "bg-blue-100 text-blue-800 border-blue-200",
      secondary: "bg-gray-100 text-gray-700 border-gray-200",
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-amber-100 text-amber-800 border-amber-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
    },
    outlined: {
      default: "bg-white text-gray-800 border-gray-300",
      primary: "bg-white text-blue-600 border-blue-300",
      secondary: "bg-white text-gray-600 border-gray-300",
      success: "bg-white text-green-600 border-green-300",
      error: "bg-white text-red-600 border-red-300",
      warning: "bg-white text-amber-600 border-amber-300",
      info: "bg-white text-blue-600 border-blue-300",
    },
  };

  const sizeClasses = {
    small: "h-6 text-xs px-2",
    medium: "h-8 text-sm px-3",
    large: "h-10 text-base px-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border font-medium transition-colors",
        colorClasses[variant][color],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center justify-center hover:opacity-70 transition-opacity ml-1 -mr-1"
          aria-label="Delete"
        >
          {deleteIcon || <X size={size === "small" ? 14 : size === "large" ? 18 : 16} />}
        </button>
      )}
    </div>
  );
};

export default Chip;
