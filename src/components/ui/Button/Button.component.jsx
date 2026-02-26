import React from "react";
import "./button.component.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  onClick,
  disabled,
  startIcon,
  endIcon,
  fullWidth,
  color, // Para compatibilidade com MUI (error, primary, etc)
  ...props
}) => {
  // Mapear variantes do MUI para as nossas
  const variantMap = {
    contained: "primary",
    outlined: "outline",
    text: "outline",
  };

  // Mapear colors do MUI
  const colorMap = {
    error: "danger",
    primary: "primary",
    secondary: "secondary",
    inherit: "outline",
  };

  const mappedVariant = variantMap[variant] || variant;
  const mappedColor = color ? colorMap[color] : null;
  const finalVariant = mappedColor || mappedVariant;

  // Monta as classes
  const classes = [
    "btn",
    finalVariant ? `btn-${finalVariant}` : "",
    size ? `btn-${size}` : "",
    fullWidth ? "w-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {startIcon && <span style={{ marginRight: '8px', display: 'inline-flex', alignItems: 'center' }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center' }}>{endIcon}</span>}
    </button>
  );
};

export default Button;