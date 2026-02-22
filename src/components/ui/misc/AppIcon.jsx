import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * Wrapper dinâmico para ícones do Lucide React.
 * Renderiza o ícone correspondente ao `name` fornecido; exibe `HelpCircle` como fallback
 * caso o nome não exista na biblioteca.
 *
 * @param {{ name: string, size?: number, color?: string, className?: string, strokeWidth?: number }} props
 *
 * @example
 * <Icon name="Trash" size={20} color="red" />
 */
function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;