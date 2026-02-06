import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Avatar Component - Componente de avatar/imagem de perfil
 */
export const Avatar = ({ 
  src, 
  alt = "Avatar",
  children,
  size = "md",
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
  };

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )} 
        {...props} 
      />
    );
  }

  return (
    <div 
      className={cn(
        "rounded-full bg-gray-200 flex items-center justify-center text-gray-600",
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Avatar;
