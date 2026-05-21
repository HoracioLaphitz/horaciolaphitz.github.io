import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
    const baseStyles = 'group relative glass-card rounded-2xl p-lg md:p-xl transition-all duration-300';
    const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-lg hover:border-accent/40' : '';

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`}>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
