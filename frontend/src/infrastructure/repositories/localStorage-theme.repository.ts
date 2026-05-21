/**
 * LocalStorage Theme Repository
 * Infrastructure layer - Concrete implementation of IThemeRepository
 * Following Dependency Inversion Principle (DIP)
 */

import type { IThemeRepository } from '@domain/repositories/theme.repository';
import type { Theme } from '@domain/entities/theme.entity';
import { isValidTheme } from '@domain/entities/theme.entity';

export class LocalStorageThemeRepository implements IThemeRepository {
  private readonly STORAGE_KEY = 'portfolio-theme';

  getTheme(): Theme | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored && isValidTheme(stored)) {
        return stored;
      }
      return null;
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      return null;
    }
  }

  setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  clearTheme(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear theme from localStorage:', error);
    }
  }
}
