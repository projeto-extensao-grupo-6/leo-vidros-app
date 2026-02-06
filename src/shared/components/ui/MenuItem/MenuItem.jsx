import React from "react";

/**
 * MenuItem Component - Option para Select
 * Usado dentro de Input com select={true}
 */
export const MenuItem = ({ children, value, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

export default MenuItem;
