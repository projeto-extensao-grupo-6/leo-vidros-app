import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Switch Component - Toggle switch customizado com Tailwind
 */
export const Switch = ({ 
  checked, 
  onChange, 
  disabled = false,
  className,
  ...props 
}) => {
  return (
    <label className={cn(
      "relative inline-flex items-center cursor-pointer",
      disabled && "cursor-not-allowed opacity-50",
      className
    )}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        disabled={disabled}
        className="sr-only peer" 
        {...props} 
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
    </label>
  );
};

export default Switch;
