/**
 * Theme Entity
 * Domain layer - Pure business logic, framework-agnostic
 */

export type Theme = 'light' | 'dark' | 'system';

export const THEMES = {
  LIGHT: 'light' as Theme,
  DARK: 'dark' as Theme,
  SYSTEM: 'system' as Theme,
} as const;

/**
 * Validates if a string is a valid theme
 */
export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (value === 'light' || value === 'dark' || value === 'system');
}

/**
 * Gets the opposite theme (for toggle functionality)
 */
export function getOppositeTheme(theme: Theme): Theme {
  if (theme === 'system') return 'light';
  return theme === 'light' ? 'dark' : 'light';
}

/**
 * Resolves 'system' theme to actual light/dark based on OS preference
 */
export function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Gets the effective theme (resolves 'system' to actual theme)
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? resolveSystemTheme() : theme;
}
