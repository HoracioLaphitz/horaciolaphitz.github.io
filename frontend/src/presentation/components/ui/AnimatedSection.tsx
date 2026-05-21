import { type ReactNode } from 'react';
import { useIntersectionObserver } from '@presentation/hooks/useIntersectionObserver';

interface AnimatedSectionProps {
    children: ReactNode;
    animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
    delay?: number;
    className?: string;
    threshold?: number;
}

export function AnimatedSection({
    children,
    animation = 'fade-in-up',
    delay = 0,
    className = '',
    threshold = 0.1,
}: AnimatedSectionProps) {
    const { ref, hasIntersected } = useIntersectionObserver({
        threshold,
        triggerOnce: true,
    });

    const animationClass = hasIntersected ? `animate-${animation}` : 'opacity-0';
    const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

    return (
        <div
            ref={ref as any}
            className={`${animationClass} ${delayClass} ${className}`}
        >
            {children}
        </div>
    );
}
