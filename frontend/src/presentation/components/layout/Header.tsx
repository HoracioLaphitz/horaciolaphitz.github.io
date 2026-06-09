import { ThemeToggle } from '../atoms/ThemeToggle';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const closeMenu = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsExiting(false);
        }, 350);
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            setIsMenuOpen(true);
        }
    };

    return (
        <>
            {/* Backdrop overlay on mobile menu open */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl glass-panel rounded-2xl transition-all duration-300">
                <div className="px-lg md:px-xl">
                    <nav className="flex items-center justify-between h-14 md:h-16">
                        <a href="/" className="text-xl font-bold tracking-tight text-text-primary hover:opacity-70 transition-opacity">
                            HL
                        </a>
                        {/* Inline nav: visible from sm: breakpoint (640px) */}
                        <div className="hidden sm:flex items-center gap-1">
                            {[
                                { href: '/#proyectos', label: 'Proyectos' },
                                { href: '/notebooks', label: 'Notebooks' },
                                { href: '/#experiencia', label: 'Experiencia' },
                                { href: '/#contacto', label: 'Contacto' },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-muted transition-all duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="h-4 w-px bg-border mx-2" />
                            <ThemeToggle variant="navbar" />
                        </div>
                        <div className="flex sm:hidden items-center gap-2">
                            <ThemeToggle variant="navbar" />
                            <button
                                onClick={toggleMenu}
                                className="p-3 text-text-primary rounded-lg hover:bg-accent-muted transition-colors"
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
                        <div
                            className={`sm:hidden py-3 border-t border-border ${isExiting ? 'animate-fade-out-up' : 'animate-fade-in'}`}
                        >
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
                                        onClick={closeMenu}
                                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-muted transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}