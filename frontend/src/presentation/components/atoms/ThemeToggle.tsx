/**
 * ThemeToggle Component
 * Presentation layer - UI for theme switching
 * Following Single Responsibility Principle (SRP)
 */

import { motion } from 'framer-motion';
import { useTheme } from '@presentation/hooks/useTheme';
import { LocalStorageThemeRepository } from '@infrastructure/repositories/localStorage-theme.repository';

const repository = new LocalStorageThemeRepository();

interface ThemeToggleProps {
    variant?: 'floating' | 'navbar';
}

export function ThemeToggle({ variant = 'floating' }: ThemeToggleProps) {
    const { effectiveTheme, toggleTheme } = useTheme({ repository });

    const isDark = effectiveTheme === 'dark';

    const buttonClass = variant === 'navbar'
        ? 'p-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border transition-colors transition-transform duration-200 hover:scale-105 active:scale-95'
        : 'fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface-elevated border border-border shadow-lg hover:shadow-xl transition-shadow';

    return (
        <motion.button
            onClick={toggleTheme}
            className={buttonClass}
            whileHover={{ scale: variant === 'navbar' ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 180 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                {isDark ? <MoonIcon /> : <SunIcon />}
            </motion.div>
        </motion.button>
    );
}

function SunIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    );
}
