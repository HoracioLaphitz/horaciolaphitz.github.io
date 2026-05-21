/**
 * useTheme Hook
 * Presentation layer - React hook for theme management
 * Following Single Responsibility Principle (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@domain/entities/theme.entity';
import { getEffectiveTheme, getOppositeTheme, THEMES } from '@domain/entities/theme.entity';
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
  // Initialize theme from storage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = repository.getTheme();
    return stored || THEMES.SYSTEM;
  });

  // Get the effective theme (resolves 'system' to actual theme)
  const effectiveTheme = getEffectiveTheme(theme);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // Listen to system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Force re-render to update effectiveTheme
      setThemeState('system');
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

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
