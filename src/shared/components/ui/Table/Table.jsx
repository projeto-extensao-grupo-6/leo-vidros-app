import React from "react";
import { cn } from "../../../../utils/cn";

/**
 * Table Component - Sistema de tabela customizado com Tailwind
 */

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 border-b border-gray-200", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-gray-200 bg-gray-50 font-medium",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef(
  ({ className, hover, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-gray-100 transition-colors",
        hover && "hover:bg-gray-50 cursor-pointer",
        selected && "bg-blue-50",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold text-gray-700 text-sm",
      "whitespace-nowrap",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef(
  ({ className, padding, colSpan, align = "left", ...props }, ref) => {
    const paddingClasses = {
      checkbox: "px-2 py-3",
      normal: "px-4 py-3",
      none: "p-0"
    };

    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    };

    return (
      <td
        ref={ref}
        colSpan={colSpan}
        className={cn(
          "align-middle text-gray-600 text-sm",
          paddingClasses[padding] || paddingClasses.normal,
          alignClasses[align],
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

export const TableContainer = React.forwardRef(
  ({ className, component: Component = "div", elevation = 0, ...props }, ref) => {
    const shadowClasses = {
      0: "",
      1: "shadow-sm",
      2: "shadow",
      3: "shadow-md"
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "relative overflow-auto rounded-lg border border-gray-200 bg-white",
          shadowClasses[elevation],
          className
        )}
        {...props}
      />
    );
  }
);
TableContainer.displayName = "TableContainer";

export default Table;
