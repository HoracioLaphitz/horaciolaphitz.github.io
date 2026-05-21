import { ThemeToggle } from '../atoms/ThemeToggle';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl glass-panel rounded-2xl border transition-all duration-300">
            <div className="px-lg md:px-xl">
                <nav className="flex items-center justify-between h-14 md:h-16">
                    {/* Logo */}
                    <a href="/" className="text-xl font-bold bg-gradient-to-r from-light-text-primary to-light-text-secondary dark:from-[#f5f5f7] dark:to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        HL
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-lg">
                        <a href="/#proyectos" className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] transition-colors relative group py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10">
                            Proyectos
                        </a>
                        <a href="/notebooks" className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] transition-colors relative group py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10">
                            Notebooks
                        </a>
                        <a href="/#experiencia" className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] transition-colors relative group py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10">
                            Experiencia
                        </a>
                        <a href="/#contacto" className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] transition-colors relative group py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10">
                            Contacto
                        </a>
                        <div className="h-4 w-px bg-light-border dark:bg-dark-border mx-xs" />
                        <ThemeToggle variant="navbar" />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-sm">
                        <ThemeToggle variant="navbar" />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-sm text-light-text-primary dark:text-[#f5f5f7] rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10 transition-colors"
                            aria-label="Toggle menu"
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

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-md border-t border-light-border dark:border-dark-border animate-fade-in">
                        <div className="flex flex-col gap-sm">
                            <a 
                                href="/#proyectos" 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10 transition-colors"
                            >
                                Proyectos
                            </a>
                            <a 
                                href="/notebooks" 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10 transition-colors"
                            >
                                Notebooks
                            </a>
                            <a 
                                href="/#experiencia" 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10 transition-colors"
                            >
                                Experiencia
                            </a>
                            <a 
                                href="/#contacto" 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-[#2997ff] py-xs px-sm rounded-lg hover:bg-light-accent-muted dark:hover:bg-accent/10 transition-colors"
                            >
                                Contacto
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
