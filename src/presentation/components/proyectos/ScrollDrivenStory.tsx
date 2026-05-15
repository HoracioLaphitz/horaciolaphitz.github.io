import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * TÉCNICA 5: SCROLL-DRIVEN STORYTELLING
 * Elementos que se animan o transforman al hacer scroll para explicar el proceso.
 * Convierte la lectura en una experiencia interactiva de "lujo digital".
 */

interface ScrollRevealProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
    delay?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    className = '',
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [delay]);

    const directionStyles = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
        fade: 'translate-y-0',
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directionStyles[direction]}`
                } ${className}`}
        >
            {children}
        </div>
    );
}

interface ScrollProgressBarProps {
    color?: string;
    height?: number;
}

export function ScrollProgressBar({ color = 'brand-primary', height = 3 }: ScrollProgressBarProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 bg-skin-border/20"
            style={{ height: `${height}px` }}
        >
            <div
                className={`h-full bg-${color} transition-all duration-150 ease-out`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

interface TransformOnScrollProps {
    from: string;
    to: string;
    children: ReactNode;
    className?: string;
}

export function TransformOnScroll({ from, to, children, className = '' }: TransformOnScrollProps) {
    const [isTransformed, setIsTransformed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsTransformed(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 ease-out ${className}`}>
            <div className={isTransformed ? to : from}>{children}</div>
        </div>
    );
}

interface DataVisualizationStoryProps {
    stages: {
        title: string;
        description: string;
        visual: ReactNode;
    }[];
    className?: string;
}

export function DataVisualizationStory({ stages, className = '' }: DataVisualizationStoryProps) {
    const [activeStage, setActiveStage] = useState(0);
    const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers = stageRefs.current.map((ref, index) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveStage(index);
                    }
                },
                { threshold: 0.6 }
            );

            if (ref) observer.observe(ref);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);

    return (
        <div className={`relative ${className}`}>
            {/* Visual fijo (sticky) */}
            <div className="sticky top-24 mb-4xl">
                <div className="bg-skin-surface border border-skin-border rounded-2xl p-xl shadow-lg">
                    <div className="transition-all duration-500">
                        {stages[activeStage]?.visual}
                    </div>
                </div>
            </div>

            {/* Etapas scrolleables */}
            <div className="space-y-[100vh]">
                {stages.map((stage, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            if (el) stageRefs.current[index] = el;
                        }}
                        className="min-h-[50vh]"
                    >
                        <div className="max-w-2xl mx-auto">
                            <ScrollReveal direction="up" delay={100}>
                                <div className="bg-skin-surface border border-skin-border rounded-xl p-xl">
                                    <div className="flex items-center gap-sm mb-md">
                                        <span className="w-8 h-8 flex items-center justify-center bg-brand-primary text-white rounded-full text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-xl font-bold text-skin-primary">{stage.title}</h3>
                                    </div>
                                    <p className="text-skin-muted leading-relaxed">{stage.description}</p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ParallaxSectionProps {
    backgroundImage?: string;
    speed?: number;
    children: ReactNode;
    className?: string;
}

export function ParallaxSection({
    backgroundImage,
    speed = 0.5,
    children,
    className = '',
}: ParallaxSectionProps) {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrolled = window.scrollY;
                const elementTop = rect.top + scrolled;
                const parallax = (scrolled - elementTop) * speed;
                setOffset(parallax);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        transform: `translateY(${offset}px)`,
                    }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function CountUp({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = '',
}: CountUpProps) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    const startTime = Date.now();
                    const endTime = startTime + duration;

                    const updateCount = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);
                        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                        setCount(Math.floor(end * easeOutQuad));

                        if (now < endTime) {
                            requestAnimationFrame(updateCount);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(updateCount);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [end, duration, hasStarted]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

interface StaggeredListProps {
    items: ReactNode[];
    staggerDelay?: number;
    className?: string;
}

export function StaggeredList({ items, staggerDelay = 100, className = '' }: StaggeredListProps) {
    return (
        <div className={className}>
            {items.map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={index * staggerDelay}>
                    {item}
                </ScrollReveal>
            ))}
        </div>
    );
}
