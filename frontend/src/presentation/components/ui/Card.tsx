import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    macOSControls?: boolean;
}

export function Card({ children, className = '', hover = false, macOSControls = true }: CardProps) {
    const baseStyles = 'group relative glass-card rounded-2xl p-lg md:p-xl transition-all duration-300';
    const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-macos dark:hover:shadow-macos-dark hover:border-[#2997ff]/40' : '';

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`}>
            {macOSControls && (
                <div className="flex gap-2 mb-lg" aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
