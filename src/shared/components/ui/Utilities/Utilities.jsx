import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Utility Components - Spinner, Paper, Divider, Collapse, Typography, Backdrop
 */

// Spinner/CircularProgress
export const Spinner = ({ 
  size = "md", 
  color = "primary",
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    primary: "border-blue-600 border-t-transparent",
    secondary: "border-gray-600 border-t-transparent",
    success: "border-green-600 border-t-transparent",
    error: "border-red-600 border-t-transparent",
    warning: "border-amber-600 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export const CircularProgress = Spinner; // Alias para compatibilidade com MUI

// Paper
export const Paper = ({ 
  children, 
  elevation = 1,
  className,
  component: Component = "div",
  ...props 
}) => {
  const elevationClasses = {
    0: "shadow-none",
    1: "shadow-sm",
    2: "shadow",
    3: "shadow-md",
    4: "shadow-lg",
    5: "shadow-xl",
    6: "shadow-2xl",
  };

  return (
    <Component
      className={cn(
        "bg-white rounded-lg",
        elevationClasses[elevation],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Box - Flexible container component
export const Box = ({ 
  children,
  component: Component = "div",
  className,
  ...props 
}) => {
  return (
    <Component
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Divider
export const Divider = ({ 
  orientation = "horizontal",
  className,
  ...props 
}) => {
  const orientationClasses = {
    horizontal: "w-full h-px",
    vertical: "h-full w-px",
  };

  return (
    <hr
      className={cn(
        "border-0 bg-gray-200",
        orientationClasses[orientation],
        className
      )}
      {...props}
    />
  );
};

// Collapse
export const Collapse = ({ 
  in: isOpen, 
  children,
  timeout = 300,
  className,
  unmountOnExit = false,
  ...props 
}) => {
  const [shouldRender, setShouldRender] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen && unmountOnExit) setShouldRender(false);
  };

  if (!shouldRender && unmountOnExit) return null;

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        className
      )}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      {children}
    </div>
  );
};

// Typography
export const Typography = ({ 
  variant = "body1",
  component,
  className,
  color = "textPrimary",
  children,
  ...props 
}) => {
  const variantMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    caption: "span",
    button: "span",
    overline: "span",
  };

  const variantClasses = {
    h1: "text-6xl font-bold",
    h2: "text-5xl font-bold",
    h3: "text-4xl font-bold",
    h4: "text-3xl font-semibold",
    h5: "text-2xl font-semibold",
    h6: "text-xl font-semibold",
    subtitle1: "text-base font-medium",
    subtitle2: "text-sm font-medium",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs",
    button: "text-sm font-medium uppercase",
    overline: "text-xs uppercase tracking-wide",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    error: "text-red-600",
    success: "text-green-600",
    warning: "text-amber-600",
    inherit: "",
  };

  const Component = component || variantMap[variant] || "p";

  return (
    <Component
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Backdrop
export const Backdrop = ({ 
  open,
  onClick,
  className,
  children,
  invisible = false,
  ...props 
}) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1200] flex items-center justify-center",
        !invisible && "bg-black/50 backdrop-blur-sm",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default {
  Spinner,
  CircularProgress,
  Paper,
  Box,
  Divider,
  Collapse,
  Typography,
  Backdrop,
};
