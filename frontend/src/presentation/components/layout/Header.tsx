import { ThemeToggle } from '../atoms/ThemeToggle';
import { useState, useEffect } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Mostrar navbar si estamos en el top de la página
            if (currentScrollY < 50) {
                setIsVisible(true);
                setLastScrollY(currentScrollY);
                return;
            }

            // Comparar scroll actual con el anterior
            if (currentScrollY > lastScrollY) {
                // Scrolling down - hide
                setIsVisible(false);
            } else {
                // Scrolling up - show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl glass-panel rounded-2xl transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
            }`}>
            <div className="px-lg md:px-xl">
                <nav className="flex items-center justify-between h-14 md:h-16">
                    <a href="/" className="text-xl font-bold tracking-tight text-text-primary hover:opacity-70 transition-opacity">
                        HL
                    </a>
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { href: '/#proyectos', label: 'Proyectos' },
                            { href: '/notebooks', label: 'Notebooks' },
                            { href: '/#experiencia', label: 'Experiencia' },
                            { href: '/#contacto', label: 'Contacto' },
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-muted transition-all duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="h-4 w-px bg-border mx-2" />
                        <ThemeToggle variant="navbar" />
                    </div>
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle variant="navbar" />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-text-primary rounded-lg hover:bg-accent-muted transition-colors"
                            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
                {isMenuOpen && (
                    <div className="md:hidden py-3 border-t border-border animate-fade-in">
                        <div className="flex flex-col gap-1">
                            {[
                                { href: '/#proyectos', label: 'Proyectos' },
                                { href: '/notebooks', label: 'Notebooks' },
                                { href: '/#experiencia', label: 'Experiencia' },
                                { href: '/#contacto', label: 'Contacto' },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-muted transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}