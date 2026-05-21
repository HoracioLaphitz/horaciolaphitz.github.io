import { useEffect, useState } from 'react';

export function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / scrollHeight) * 100;
            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress(); // Initial call

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div
            className="scroll-progress"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
            aria-hidden="true"
        />
    );
}
