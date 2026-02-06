import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../../utils/cn";
import { X } from "lucide-react";

/**
 * Modal Component - Modal customizado com Tailwind
 */

export const Modal = ({
  open,
  onClose,
  children,
  className,
  closeOnBackdropClick = true,
  showCloseButton = false,
  size = "md",
  ...props
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full mx-4"
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      {...props}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-2xl w-full",
          "transform transition-all",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Fechar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const ModalHeader = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex items-center justify-between p-6 border-b border-gray-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const ModalBody = ({ children, className, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 p-6 border-t border-gray-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const ModalTitle = ({ children, className, ...props }) => (
  <h2
    className={cn("text-xl font-semibold text-gray-900", className)}
    {...props}
  >
    {children}
  </h2>
);

export const ModalDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-gray-600 mt-2", className)} {...props}>
    {children}
  </p>
);

// Alias para compatibilidade com MUI
export const Box = ({ children, className, component: Component = "div", ...props }) => (
  <Component className={cn("", className)} {...props}>
    {children}
  </Component>
);

export default Modal;
