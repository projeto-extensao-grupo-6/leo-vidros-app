import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Stack Component - Container com flexbox para empilhar elementos
 */
export const Stack = ({ 
  children, 
  spacing = 2, 
  direction = "column",
  className,
  ...props 
}) => {
  const spacingMap = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
  };

  return (
    <div 
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        spacingMap[spacing] || `gap-${spacing}`,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Stack;
