import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Grid Component - Sistema de grid responsivo
 */
export const Grid = ({ 
  children, 
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 4,
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
    8: "gap-8",
  };

  if (container) {
    return (
      <div 
        className={cn(
          "grid grid-cols-1",
          sm && "sm:grid-cols-2",
          md && "md:grid-cols-2",
          lg && "lg:grid-cols-3",
          spacingMap[spacing],
          className
        )} 
        {...props}
      >
        {children}
      </div>
    );
  }

  if (item) {
    return (
      <div className={cn("flex-shrink-0", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default Grid;
