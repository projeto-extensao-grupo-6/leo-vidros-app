import React from "react";
import "./button.component.css";

function Button({ children, variant = "primary", size = "md", onClick, type = "button" }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
