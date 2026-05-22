/**
 * useTheme Hook
 * Presentation layer - React hook for theme management
 * Following Single Responsibility Principle (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@domain/entities/theme.entity';
import { getOppositeTheme, THEMES } from '@domain/entities/theme.entity';
import type { IThemeRepository } from '@domain/repositories/theme.repository';

interface UseThemeOptions {
  repository: IThemeRepository;
}

interface UseThemeReturn {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

export function useTheme({ repository }: UseThemeOptions): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = repository.getTheme();
    return stored || THEMES.SYSTEM;
  });

  // Track system preference separately so changes trigger re-render
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Derive effective theme from theme + system preference
  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set theme and persist to storage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      repository.setTheme(newTheme);
    },
    [repository]
  );

  // Toggle between light and dark (ignores system)
  const toggleTheme = useCallback(() => {
    const opposite = getOppositeTheme(theme);
    setTheme(opposite);
  }, [theme, setTheme]);

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    isSystemTheme: theme === 'system',
  };
}
