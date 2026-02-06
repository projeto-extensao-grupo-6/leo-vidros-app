import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * FormControlLabel Component - Label para controles de formulário
 */
export const FormControlLabel = ({ 
  control, 
  label,
  disabled = false,
  className,
  labelClassName,
  ...props 
}) => {
  return (
    <div className={cn(
      "flex items-center gap-2",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )} {...props}>
      {control}
      {label && (
        <span className={cn(
          "text-sm text-gray-700",
          labelClassName
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

export default FormControlLabel;
