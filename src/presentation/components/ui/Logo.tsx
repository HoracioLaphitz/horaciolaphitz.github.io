interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {/* Logo optimizado para ambos temas */}
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 dark:from-neutral-300 dark:to-neutral-100 flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                <span className="text-white dark:text-neutral-900 font-bold text-sm">
                    HL
                </span>
            </div>
        </div>
    );
};

export default Logo;