import React from "react";
import "./button.component.css";

const Button = ({
  children,
  variant,
  size,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const classes = [
    variant ? `btn-${variant}` : "",
    size ? `btn-${size}` : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
