import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    className = '',
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.04] active:scale-[0.96] cubic-bezier(0.16, 1, 0.3, 1)';

    const variants = {
        primary: 'bg-gradient-to-r from-[#0071e3] to-[#2997ff] text-white shadow-md hover:shadow-lg hover:shadow-[#0071e3]/20 border border-[#0071e3]/20',
        secondary: 'bg-black/5 dark:bg-white/10 text-light-text-primary dark:text-[#f5f5f7] border border-light-border dark:border-dark-border hover:bg-black/10 dark:hover:bg-white/15 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-md py-sm text-sm',
        md: 'px-lg py-md text-base',
        lg: 'px-xl py-lg text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}
