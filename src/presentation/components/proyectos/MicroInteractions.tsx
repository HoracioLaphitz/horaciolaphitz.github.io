import { useState, useRef } from 'react';
import type { ReactNode, MouseEvent } from 'react';

/**
 * WILDCARD: MICRO-INTERACCIONES EN CTAs
 * Efectos sutiles que transmiten calidad premium antes de leer el contenido.
 * Equivalente digital a un papel de tarjeta personal de alto gramaje.
 */

interface GlowButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function GlowButton({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
}: GlowButtonProps) {
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setGlowPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const variantStyles = {
        primary: 'bg-brand-primary text-white hover:bg-brand-hover border-brand-primary',
        secondary: 'bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary/10',
        ghost: 'bg-transparent text-skin-primary border-skin-border hover:border-brand-primary',
    };

    const sizeStyles = {
        sm: 'px-sm py-xs text-sm',
        md: 'px-md py-sm text-base',
        lg: 'px-lg py-md text-lg',
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            ref={buttonRef as any}
            href={href}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        relative overflow-hidden
        inline-flex items-center justify-center gap-xs
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        border-2 rounded-lg
        font-medium
        transition-all duration-300
        ${className}
      `}
            style={{
                fontVariationSettings: isHovered ? '"wght" 600' : '"wght" 500',
            }}
        >
            {/* Glow effect que sigue al cursor */}
            {isHovered && (
                <span
                    className="absolute pointer-events-none"
                    style={{
                        left: glowPosition.x,
                        top: glowPosition.y,
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                        transition: 'opacity 0.3s',
                    }}
                />
            )}

            {/* Contenido */}
            <span className="relative z-10">{children}</span>
        </Component>
    );
}

interface MagneticButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    strength?: number;
    className?: string;
}

export function MagneticButton({
    children,
    href,
    onClick,
    strength = 0.3,
    className = '',
}: MagneticButtonProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;
            setPosition({ x: deltaX, y: deltaY });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            ref={buttonRef as any}
            href={href}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
        inline-flex items-center justify-center gap-xs
        px-lg py-md
        bg-brand-primary text-white
        border-2 border-brand-primary
        rounded-xl
        font-semibold
        transition-all duration-200
        hover:shadow-xl
        ${className}
      `}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            {children}
        </Component>
    );
}

interface AnimatedLinkProps {
    children: ReactNode;
    href: string;
    variant?: 'underline' | 'arrow' | 'fade';
    className?: string;
}

export function AnimatedLink({
    children,
    href,
    variant = 'underline',
    className = '',
}: AnimatedLinkProps) {
    const [isHovered, setIsHovered] = useState(false);

    const variants = {
        underline: (
            <span className="relative">
                {children}
                <span
                    className="absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300"
                    style={{ width: isHovered ? '100%' : '0%' }}
                />
            </span>
        ),
        arrow: (
            <span className="inline-flex items-center gap-xs">
                {children}
                <svg
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </span>
        ),
        fade: (
            <span
                className="transition-opacity duration-300"
                style={{ opacity: isHovered ? 0.7 : 1 }}
            >
                {children}
            </span>
        ),
    };

    return (
        <a
            href={href}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`text-brand-primary font-medium transition-colors ${className}`}
        >
            {variants[variant]}
        </a>
    );
}

interface PulseIconProps {
    icon: ReactNode;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PulseIcon({ icon, color = 'brand-primary', size = 'md', className = '' }: PulseIconProps) {
    const sizeStyles = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`relative ${sizeStyles[size]} ${className}`}>
            {/* Pulso animado */}
            <span
                className={`absolute inset-0 bg-${color} rounded-full opacity-20 animate-ping`}
                style={{ animationDuration: '2s' }}
            />
            {/* Icono */}
            <span className={`relative flex items-center justify-center w-full h-full bg-${color}/10 text-${color} rounded-full`}>
                {icon}
            </span>
        </div>
    );
}

interface RippleButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function RippleButton({ children, onClick, className = '' }: RippleButtonProps) {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();

            setRipples((prev) => [...prev, { x, y, id }]);

            setTimeout(() => {
                setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
            }, 600);
        }

        onClick?.();
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={`
        relative overflow-hidden
        px-lg py-md
        bg-brand-primary text-white
        rounded-lg
        font-medium
        transition-all duration-200
        hover:bg-brand-hover
        ${className}
      `}
        >
            {/* Ripples */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}

            {/* Contenido */}
            <span className="relative z-10">{children}</span>
        </button>
    );
}

interface ShimmerTextProps {
    children: string;
    className?: string;
}

export function ShimmerText({ children, className = '' }: ShimmerTextProps) {
    return (
        <span
            className={`
        relative inline-block
        bg-gradient-to-r from-brand-primary via-accent-primary to-brand-primary
        bg-clip-text text-transparent
        bg-[length:200%_100%]
        animate-shimmer
        ${className}
      `}
        >
            {children}
        </span>
    );
}

interface HoverScaleProps {
    children: ReactNode;
    scale?: number;
    className?: string;
}

export function HoverScale({ children, scale = 1.05, className = '' }: HoverScaleProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`transition-transform duration-300 ${className}`}
            style={{
                transform: isHovered ? `scale(${scale})` : 'scale(1)',
            }}
        >
            {children}
        </div>
    );
}

// Añadir animaciones al CSS global
const styles = `
@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

.animate-shimmer {
  animation: shimmer 3s linear infinite;
}
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
