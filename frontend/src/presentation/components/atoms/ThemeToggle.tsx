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
        ? 'p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-accent-muted transition-all duration-200'
        : 'fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface-elevated border border-border shadow-lg hover:shadow-xl transition-shadow';

    return (
        <motion.button
            onClick={toggleTheme}
            className={buttonClass}
            whileTap={{ scale: 0.92 }}
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    );
}